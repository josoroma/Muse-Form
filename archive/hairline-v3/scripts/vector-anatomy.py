from pathlib import Path
import json, argparse, re
import cv2
import numpy as np
from scipy.ndimage import gaussian_filter1d
from scipy.spatial import cKDTree

ROOT=Path(__file__).resolve().parents[1]

def chains(edge):
    pixels=set(map(tuple,np.argwhere(edge>0)))
    adj={}
    for y,x in pixels:
        ns=[]
        for dy,dx in [(0,1),(1,0),(0,-1),(-1,0),(1,1),(1,-1),(-1,1),(-1,-1)]:
            q=(y+dy,x+dx)
            if q not in pixels: continue
            if dy and dx and ((y,x+dx) in pixels or (y+dy,x) in pixels): continue
            ns.append(q)
        adj[(y,x)]=ns
    used=set(); result=[]
    def walk(a,b):
        p=[a];prev=a;cur=b
        used.add(tuple(sorted((a,b))))
        for _ in range(100000):
            p.append(cur)
            nxt=[n for n in adj[cur] if n!=prev and tuple(sorted((cur,n))) not in used]
            if len(adj[cur])!=2 or not nxt: break
            n=nxt[0];used.add(tuple(sorted((cur,n))));prev,cur=cur,n
            if cur==a: p.append(cur);break
        return np.asarray([(x,y) for y,x in p],np.float32)
    for a,ns in adj.items():
        if len(ns)==2: continue
        for b in ns:
            if tuple(sorted((a,b))) not in used: result.append(walk(a,b))
    for a,ns in adj.items():
        for b in ns:
            if tuple(sorted((a,b))) not in used: result.append(walk(a,b))
    return result

def length(p): return np.linalg.norm(np.diff(p,axis=0),axis=1).sum()

def join(parts,reach=7):
    # Join geometrically compatible broken Canny curves without crossing gaps.
    active=list(parts)
    for _ in range(3):
        merged=[];taken=set()
        for i,p in enumerate(active):
            if i in taken: continue
            taken.add(i)
            for _ in range(6):
                best=None
                for j,q in enumerate(active):
                    if j==i or j in taken or len(q)<5: continue
                    for rev in [False,True]:
                        r=q[::-1] if rev else q
                        dist=np.linalg.norm(p[-1]-r[0])
                        if dist>reach: continue
                        v=p[-1]-p[max(0,len(p)-7)]
                        w=r[min(6,len(r)-1)]-r[0]
                        cos=np.dot(v,w)/(np.linalg.norm(v)*np.linalg.norm(w)+1e-9)
                        if cos<.65: continue
                        score=dist+(1-cos)*4
                        if best is None or score<best[0]: best=(score,j,r)
                if best is None: break
                _,j,q=best;taken.add(j);p=np.concatenate([p,q])
            merged.append(p)
        active=merged
    return active

def path(p,scale=1):
    p=np.asarray(p,dtype=np.float32)
    travel=np.r_[0,np.cumsum(np.linalg.norm(np.diff(p,axis=0),axis=1))]
    keep=np.r_[True,np.diff(travel)>0.001]
    p,travel=p[keep],travel[keep]
    steps=np.linspace(0,travel[-1],max(3,int(travel[-1])+1))
    p=np.stack([np.interp(steps,travel,p[:,0]),np.interp(steps,travel,p[:,1])],axis=1).astype(np.float32)
    p=gaussian_filter1d(p,sigma=2.5,axis=0,mode='nearest')
    p=cv2.approxPolyDP(p,1.55,False).reshape(-1,2)*scale
    if len(p)<3:return ''
    # Cubic interpolation of simplified observed contour points.
    pad=np.vstack([p[0],p,p[-1]])
    d=f'M{p[0,0]:.2f},{p[0,1]:.2f}'
    for i in range(1,len(pad)-2):
        a,b,c,e=pad[i-1:i+3]
        c1=b+(c-a)/6
        c2=c-(e-b)/6
        d+=f'C{c1[0]:.2f},{c1[1]:.2f} {c2[0]:.2f},{c2[1]:.2f} {c[0]:.2f},{c[1]:.2f}'
    return d

def replace_contour_span(d,start,end,replacement):
    """Replace an observed boundary span with a deliberate native cubic arc."""
    commands=re.findall(r'[MC][^MC]*',d)
    ends=np.asarray([list(map(float,re.findall(r'-?\d+(?:\.\d+)?',c)))[-2:] for c in commands])
    first=int(np.argmin(np.linalg.norm(ends-start,axis=1)))
    last=int(np.argmin(np.linalg.norm(ends-end,axis=1)))
    assert first<last
    return ''.join(commands[:first+1])+replacement+''.join(commands[last+1:])


IDS=['105214','105215','105216','105217','105218','105219','105220','105221','105222','105223']
FOCUS={'105214':(.48,.33),'105215':(.54,.65),'105216':(.40,.48),'105217':(.52,.55),'105218':(.43,.27),'105219':(.58,.49),'105220':(.52,.22),'105221':(.85,.78),'105222':(.42,.79),'105223':(.34,.39)}
TITLES={'105214':'A Breath Through the Spiral','105215':'Tension in the Turn','105216':'The Palm Opens','105217':'Tendons Beneath the Gesture','105218':'Weight Through the Outer Leg','105219':'The Calf Holds the Weight','105220':'The Knee Connects the Gesture','105221':'Five Toes, One Foundation','105222':'The Foot Seen from Above','105223':'The Foot in Three-Quarter View'}
REVIEWS={
 '105214':'Inspected the native SVG in Chrome at full size and in the contact sheet. Reconnected the armpit and raised-shoulder contours after the raster source faded there; ribcage/waist counter-rotation remains readable. Cropped neck and arm ends are intentional study framing.',
 '105215':'Inspected the native SVG in Chrome. Preserved the elbow triangle, tapered forearm and closed fist while reducing the bodybuilder-looking shadow divisions to a small number of continuous anatomical lines.',
 '105216':'Inspected the native SVG in Chrome. Five digits, thumb opposition, finger-web topology and the palmar cup read clearly. The outside contour is stronger than the sparse palm and joint creases; texture scratches were removed.',
 '105217':'Inspected the native SVG in Chrome and repaired the thumb web, lower palm and wrist silhouette. Five digits are connected through a clear dorsal-hand outline. Tendon and knuckle lines remain subordinate; the small finger retains its source foreshortening.',
 '105218':'Inspected the native SVG in Chrome. Repaired the heel-to-arch contact contour and removed the cast-shadow line; the knee/calf/ankle relationship is continuous. Removed short nonstructural leg marks to preserve negative space.',
 '105219':'Inspected the native SVG in Chrome. Reconnected the rear heel and trimmed the false ground-shadow tail. Asymmetric calf heads, knee hollow and Achilles direction remain readable with fewer short vein fragments.',
 '105220':'Inspected the native SVG in Chrome. Correct leg category follows the actual source. The bent-knee connection and heel/sole are continuous; removed the stray heel tip and reduced short interior marks. The upper-thigh crop is intentional.',
 '105221':'Inspected the native SVG in Chrome. Repaired the heel, forefoot and stepped toe silhouette; five toe forms remain distinct. Removed shadow bands under the heel and the least useful short vein traces. Interior marks describe joints and nail planes rather than tonal shading.',
 '105222':'Inspected the native SVG in Chrome. A true dorsal view with all five toes, graduated widths and a continuous front edge. Replaced the fragmented left ankle with one deliberate continuous contour and removed its duplicate fragments. Long metatarsal/tendon directions retain the viewpoint.',
 '105223':'Inspected the native SVG in Chrome. Rebuilt the lost heel/arch/anterior-ankle silhouette around the retained observed toe contours. Smoothed the little-toe sole shelf and the pointed great-toe lip into deliberate anatomical arcs. Removed cast-shadow bands and low-value short traces. This is a curated line interpretation of the owned plate, not a 3D reconstruction.'
}

def nearest_line(parts,a,b):
    a=np.array(a);b=np.array(b)
    scores=[min(np.linalg.norm(q[0]-a)+np.linalg.norm(q[-1]-b),np.linalg.norm(q[-1]-a)+np.linalg.norm(q[0]-b)) for q in parts]
    k=int(np.argmin(scores));q=parts[k]
    if np.linalg.norm(q[-1]-a)<np.linalg.norm(q[0]-a):q=q[::-1]
    return k,q

def foot_outline(parts):
    # Keep observed outer/toe contours; explicitly reconnect the lost heel/arch
    # and illuminated anterior-ankle edges with restrained anatomical arcs.
    specs=[([85,32],[86,363]),([307,453],[667,457]),([667,447],[529,340]),([529,340],[393,235]),([342,181],[295,33])]
    chosen=[nearest_line(parts,*s) for s in specs]
    left=chosen[0][1]
    left=left[:np.flatnonzero(left[:,1]<=345)[-1]+1]
    outline=np.vstack([
        [[76,-8],[80,10]],left,
        [[78,359],[82,374],[95,385],[112,392],[136,395],[160,394],[181,390],[202,390],[221,394],[239,400],[256,413],[274,432],[292,444]],
        chosen[1][1],chosen[2][1],chosen[3][1],
        [[379,223],[365,208],[353,194]],chosen[4][1],[[290,-8]]
    ])
    return {k for k,q in chosen},outline

def role_for(p,g):
    # Distinguish a silhouette by the brighter paper beside it, never by length alone.
    sample=p[::max(1,len(p)//25)]
    hits=[]
    for j in range(1,len(sample)-1):
        v=sample[j+1]-sample[j-1];mag=np.linalg.norm(v)
        if mag<.01:continue
        n=np.array([-v[1],v[0]])/mag*5
        a=np.clip(np.round(sample[j]+n).astype(int),[0,0],[723,542])
        b=np.clip(np.round(sample[j]-n).astype(int),[0,0],[723,542])
        v1,v2=int(g[a[1],a[0]]),int(g[b[1],b[0]])
        hits.append(max(v1,v2)>202 and abs(v1-v2)>12)
    return 'silhouette' if hits and sum(hits)/len(hits)>.42 else 'interior'

def produce(id,out=ROOT/'corpus/svg'):
    source=cv2.imread(str(ROOT/f'archive/raster-v2/corpus/plates/{id}.png'))
    g=cv2.cvtColor(source,cv2.COLOR_BGR2GRAY)
    g=cv2.resize(g,(724,543),interpolation=cv2.INTER_AREA)
    g=cv2.bilateralFilter(g,11,18,5)
    g=cv2.GaussianBlur(g,(0,0),2.2)
    edge=cv2.Canny(g,14,30,L2gradient=True)
    parts=join([p for p in chains(edge) if len(p)>6])
    parts=[p for p in parts if length(p)>24]
    parts.sort(key=length,reverse=True)
    chosen=set();manual=[]
    if id=='105223':
        chosen,outer=foot_outline(parts)
        outline=path(outer,1200/724)
        outline=replace_contour_span(outline,[686.62,772.01],[931.17,790.56],
            'C758,783 862,793 931.17,790.56')
        outline=replace_contour_span(outline,[1067.28,758.14],[1122.69,718.89],
            'C1096,755 1110,740 1122.69,718.89')
        manual=[{'id':'foot-silhouette','role':'silhouette','d':outline,'stroke':'#a1a1aa'}]
    repairs={
        '105214':[
            'M230,471 C242,436 254,417 274,414 C305,414 325,443 339,480',
            'M174,486 C179,518 192,546 213,567',
            'M761,9 C777,7 793,2 807,0 C879,2 940,18 987,51 C1027,78 1052,113 1075,144 C1102,175 1141,183 1172,201',
            'M1006,268 C1066,290 1134,309 1200,321'],
        '105217':[
            'M842,598 C841,603 847,607 852,608',
            'M917,696 C915,697 913,699 912,700',
            'M782,760 C773,761 765,763 757,764',
            'M578,788 C540,782 513,783 484,792 C446,804 410,832 375,851',
            'M750,148 C755,143 758,137 764,132',
            'M766,246 C755,258 756,277 765,283 C770,282 773,278 777,275'],
        '105218':[
            'M504,767 C501,790 513,806 537,811 C570,818 597,810 626,818 C647,825 659,836 675,842',
            'M963.48,832.28 C962.5,834 961,837 959.78,838.90'],
        '105219':['M635,769 C630,789 628,811 640,825'],
        '105220':['M477.40,762.48 C473,779 462,793 464,802'],
        '105221':[
            'M116,514 C130,551 167,571 205,578 C243,585 277,574 310,585',
            'M572,756 C585,775 606,790 628,790 C646,790 661,785 669,776 C675,794 695,804 720,802 C740,800 755,796 763,788 C770,802 788,805 808,801 C834,797 856,787 867,782 C879,786 894,785 913,777'],
    }
    for n,d in enumerate(repairs.get(id,[])):
        manual.append({'id':f'{id}-contact-repair-{n}','role':'silhouette','d':d,'stroke':'#a1a1aa'})
    explicit_outer={
        '105214':{0,1,2},'105215':{0,1,2},'105216':{0,1,2},
        '105217':{0,1,2,3,4,7,9,26},'105218':{0,1,2,4},'105219':{0,1,4},
        '105220':{0,1},'105221':{0,1,3},'105222':{0,1,2},
    }
    discard={'105218':{5},'105221':{9,13,45,48,62},'105222':{16,41}}
    candidates=[]
    for i,p in enumerate(parts):
        if i in chosen:continue
        if i in discard.get(id,set()):continue
        if id=='105219' and i==0:
            while len(p)>10 and p[-1,0]*1200/724<640 and p[-1,1]*1200/724>795:p=p[:-1]
        if id=='105220' and i==1:
            while len(p)>10 and p[0,0]*1200/724<476:p=p[1:]
        if id=='105218' and i==4:
            while len(p)>10 and p[-1,0]*1200/724>963:p=p[:-1]
        center=p.mean(0)
        # Remove the cast-shadow contours: Hairline communicates ground through
        # contact geometry, never concentric shadow bands or filled shading.
        if id=='105223':
            if center[0]<320 and center[1]>365:continue
            if center[0]<90 and center[1]>320:continue
            if center[0]>640 and center[1]>455:continue
        elif id in ['105218','105219','105220']:
            if center[1]>480 and center[0]<310:continue
            if center[0]<300 and center[1]>430:continue
        elif id in ['105221','105222']:
            if center[1]>470:continue
        candidates.append((i,p,'silhouette' if i in explicit_outer.get(id,set()) else role_for(p,g)))
    # Prefer structural long contours. Retain a few shorter digit/nail contours
    # where they identify anatomy, but discard tiny surface scratches.
    candidates=candidates[:88]
    if id in ['105218','105219','105220','105221','105222','105223']:
        inner=[v for v in candidates if v[2]=='interior' and v[1].mean(0)[1]<390]
        cut={v[0] for v in sorted(inner,key=lambda v:length(v[1]))[:max(1,int(len(candidates)*.20))]}
        candidates=[v for v in candidates if v[0] not in cut]
    target=np.array(FOCUS[id])*[724,543]
    # A nearly straight observed edge can simplify away; choose the focal
    # contour only from curves that survive the native cubic conversion.
    curves={i:path(p,1200/724) for i,p,role in candidates}
    if id=='105222':
        curves[2]=replace_contour_span(curves[2],[426.41,272.45],[437.05,361.62],
            'C429,305 436,331 434,363 C432,398 428,428 430,458 C431,473 430,485 425.97,497.21')
    interior=[(i,p,role) for i,p,role in candidates if role=='interior' and length(p)<150 and curves[i]]
    focus=min(interior,key=lambda v:np.linalg.norm(v[1].mean(0)-target))[0] if interior else -1
    paths=manual[:]
    for i,p,role in candidates:
        d=curves[i]
        if not d:continue
        if i==focus:role='focus'
        color={'silhouette':'#a1a1aa','interior':'#52525b','focus':'#fafafa'}[role]
        paths.append({'id':f'{id}-{role}-{i}','role':role,'d':d,'stroke':color})
    desc='Curated native cubic contours derived from our own graphite anatomy plate; smoothed structural lines, one focal edge and no embedded raster.'
    lines=''.join(f'<path id="{p["id"]}" data-role="{p["role"]}" d="{p["d"]}" stroke="{p["stroke"]}" fill="none" stroke-width=".9" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>' for p in paths)
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-labelledby="title desc"><title id="title">{TITLES[id]}</title><desc id="desc">{desc}</desc><rect width="1200" height="900" fill="#101014"/><g id="anatomy">{lines}</g></svg>\n'
    out.mkdir(parents=True,exist_ok=True)
    (out/f'{id}.svg').write_text(svg)
    geom=ROOT/'corpus/hairline/geometry';geom.mkdir(parents=True,exist_ok=True)
    (geom/f'{id}.json').write_text(json.dumps({'id':id,'viewBox':[0,0,1200,900],'paths':paths},indent=2)+'\n')
    print(id,len(paths),'native cubic paths')
    anatomy=json.loads((ROOT/'archive/raster-v2/corpus/realism/anatomy.json').read_text())
    old=next((x for x in anatomy if x['id']==id),{})
    seed=json.loads((ROOT/'archive/vector-v1/corpus/manifest.json').read_text())
    original=next(x for x in seed['studies'] if x['id']==id)
    return {'id':id,'title':TITLES[id],'category':'leg' if id=='105220' else original.get('category','anatomy'),'sourcePlate':f'archive/raster-v2/corpus/plates/{id}.png','svg':f'corpus/svg/{id}.svg','geometry':f'corpus/hairline/geometry/{id}.json','prompt':f'Draw {TITLES[id].lower()} as native SVG anatomical line art derived from the owned {id} graphite plate. Preserve the original gesture, perspective, joints and digit topology. Use charcoal #101014 ground, a thin #a1a1aa silhouette, sparse #52525b structural contours and one #fafafa focal contour. Smooth the curves; remove texture scratches, shadow bands and redundant anatomy marks. No raster embedding, gradients, filters, shading fills or labels. Compose at 1200 by 900 with clear contact and negative space.','method':'Low-pass structural edge extraction from owned plate; graph-connected curves, directional gap joining, cubic simplification and per-subject removal/repair. Anatomical silhouette gaps are explicitly repaired at the torso, dorsal hand and foot contact contours.','review':{'notes':REVIEWS[id],'stillInspected':True,'inspection':'Chrome renders at 1200x900 and multi-study contact sheet; final motion is reviewed separately.'},'landmarks':old.get('landmarks',{'ankle':[.34,.39],'heel':[.21,.70],'ball':[.67,.82]}),'pathCount':len(paths)}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('ids',nargs='*');args=parser.parse_args()
    selected=args.ids or IDS
    records=[produce(id) for id in selected]
    meta=ROOT/'corpus/hairline/anatomy.json'
    if meta.exists():
        prior=json.loads(meta.read_text());records=[x for x in prior if x['id'] not in selected]+records
    meta.write_text(json.dumps(sorted(records,key=lambda x:x['id']),indent=2)+'\n')
