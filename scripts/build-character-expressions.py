#!/usr/bin/env python3
"""Transfer CC0 MakeHuman face units to the licensed skinned character.

This is an independently authored data converter, not MakeHuman/MPFB runtime code.
Requires numpy and scipy. Rebuild with:
  python scripts/build-character-expressions.py --source /path/to/base_body.glb
Without --source the pinned CC0 source GLB is fetched into a temporary directory.
All 52 official ARKit-style units become exp_<unit> glTF morph targets. OBJ UVs
identify source vertices exactly, including glTF seam duplicates; MHClO's stored
barycentric weights bind accessory vertices to the same deforming base surface.
"""
from __future__ import annotations
import argparse, collections, hashlib, io, json, struct, tempfile, urllib.request, zipfile
from pathlib import Path
import numpy as np
from scipy.spatial import cKDTree

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'three/character/assets'
COMMIT = '852e48f316b90a0937234886630e4fb4cdfd1f78'
SOURCE_URL = f'https://raw.githubusercontent.com/kblood/CharacterCreator/{COMMIT}/output/base_body.glb'
SOURCE_SHA = 'b5b450af89f6fbf8debf387eda8da40cd0a8c3253a2d59871c730ce7e7f46469'
DTYPES = {5120:np.int8,5121:np.uint8,5122:np.dtype('<i2'),5123:np.dtype('<u2'),5125:np.dtype('<u4'),5126:np.dtype('<f4')}
WIDTHS = {'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
PROXIES = {'Eyebrows':'eyebrows/eyebrow001/eyebrow001','Eyelashes':'eyelashes/eyelashes01/eyelashes01','Eyes':'eyes/high-poly/high-poly','Teeth':'teeth/teeth_base/teeth_base','Tongue':'tongue/tongue01/tongue01'}

class GLB:
    def __init__(self, data):
        assert data[:4] == b'glTF'
        n = struct.unpack_from('<I',data,12)[0]
        self.j = json.loads(data[20:20+n]); size = struct.unpack_from('<I',data,20+n)[0]
        self.bin = bytearray(data[28+n:28+n+size])
    def read(self, index):
        a=self.j['accessors'][index]; width=WIDTHS[a['type']]; dtype=DTYPES[a['componentType']]
        out=np.zeros((a['count'],width),dtype=dtype)
        def values(view, offset, count, width, dtype):
            v=self.j['bufferViews'][view]; stride=v.get('byteStride',np.dtype(dtype).itemsize*width)
            return np.ndarray((count,width),dtype=dtype,buffer=self.bin,offset=v.get('byteOffset',0)+offset,strides=(stride,np.dtype(dtype).itemsize)).copy()
        if 'bufferView' in a:out=values(a['bufferView'],a.get('byteOffset',0),a['count'],width,dtype)
        if 'sparse' in a:
            s=a['sparse'];i=s['indices'];v=s['values']
            ids=values(i['bufferView'],i.get('byteOffset',0),s['count'],1,DTYPES[i['componentType']]).reshape(-1)
            out[ids]=values(v['bufferView'],v.get('byteOffset',0),s['count'],width,dtype)
        if a.get('normalized'):out=np.maximum(out.astype(np.float64)/np.iinfo(dtype).max,-1)
        return out.astype(np.float64)
    def view(self, data):
        while len(self.bin)%4:self.bin.append(0)
        offset=len(self.bin);self.bin.extend(data)
        self.j['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(data)})
        return len(self.j['bufferViews'])-1
    def morph(self, values):
        values=np.asarray(values,dtype='<f4');active=np.flatnonzero(np.max(abs(values),axis=1)>1e-8)
        a={'componentType':5126,'count':len(values),'type':'VEC3','min':values.min(0).tolist(),'max':values.max(0).tolist()}
        if len(active):
            dtype='<u2' if len(values)<65536 else '<u4'; ctype=5123 if dtype=='<u2' else 5125
            a['sparse']={'count':len(active),'indices':{'bufferView':self.view(active.astype(dtype).tobytes()),'componentType':ctype},'values':{'bufferView':self.view(values[active].tobytes())}}
        self.j['accessors'].append(a);return len(self.j['accessors'])-1
    def save(self,path):
        while len(self.bin)%4:self.bin.append(0)
        self.j['buffers'][0]['byteLength']=len(self.bin)
        raw=json.dumps(self.j,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4)
        path.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(raw)+len(self.bin))+struct.pack('<I4s',len(raw),b'JSON')+raw+struct.pack('<I4s',len(self.bin),b'BIN\0')+self.bin)

def obj_data(text):
    verts=[];uv=[];uvmap=collections.defaultdict(set)
    for line in text.splitlines():
        s=line.split()
        if not s:continue
        if s[0]=='v':verts.append(list(map(float,s[1:4])))
        elif s[0]=='vt':uv.append(tuple(map(float,s[1:3])))
        elif s[0]=='f':
            for token in s[1:]:
                vi,ti,*_=token.split('/');uvmap[uv[int(ti)-1]].add(int(vi)-1)
    return np.array(verts),uvmap

def bindings(text, count):
    rows=[];active=False
    for line in text.splitlines():
        s=line.split()
        if not s:continue
        if s[0]=='verts':active=True;continue
        if not active:continue
        if not s[0].isdigit():break
        if len(s)==1:rows.append(([int(s[0]),0,0],[1.,0.,0.]))
        elif len(s)==9:rows.append((list(map(int,s[:3])),list(map(float,s[3:6]))))
        else:raise ValueError('Unrecognized CC0 binding row')
    assert len(rows)==count,(len(rows),count)
    return np.array([r[0] for r in rows]),np.array([r[1] for r in rows])

def normals(pos, triangles, remap):
    # Average area-weighted normals over original OBJ vertices, across UV seams.
    p=pos[triangles];cross=np.cross(p[:,1]-p[:,0],p[:,2]-p[:,0]); sums=np.zeros((int(remap.max())+1,3))
    for axis in range(3):np.add.at(sums,remap[triangles[:,axis]],cross)
    mag=np.linalg.norm(sums,axis=1);sums/=np.maximum(mag[:,None],1e-15)
    return sums[remap]

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--source',type=Path);ap.add_argument('--output',type=Path,default=ASSETS/'adult-female-source.glb');args=ap.parse_args()
    raw=args.source.read_bytes() if args.source else urllib.request.urlopen(SOURCE_URL,timeout=45).read()
    assert hashlib.sha256(raw).hexdigest()==SOURCE_SHA,'Source GLB differs from the pinned CC0 input'
    glb=GLB(raw);j=glb.j;z=zipfile.ZipFile(ASSETS/'makehuman-expression-inputs.zip')
    base,base_uv=obj_data(z.read('base.obj').decode());targets={}
    for name in sorted(z.namelist()):
        if not name.startswith('faceunits/targets/') or not name.endswith('.target'):continue
        dense=np.zeros_like(base)
        for line in z.read(name).decode().splitlines():
            s=line.split()
            if len(s)==4 and s[0].isdigit():dense[int(s[0])]=list(map(float,s[1:]))
        targets['exp_'+Path(name).stem]=dense*.1 # MakeHuman decimetres → glTF metres; same XYZ axes.
    report={'source':SOURCE_URL,'sourceSHA256':SOURCE_SHA,'license':'CC0-1.0','targetNames':list(targets),'meshes':[]}
    for mesh in j['meshes']:
        name=mesh['name'];source=base;uvmap=base_uv;bind=None
        if name!='base':
            path='proxies/'+PROXIES[name];source,uvmap=obj_data(z.read(path+'.obj').decode());bind=bindings(z.read(path+'.mhclo').decode(),len(source))
        keys=list(uvmap);tree=cKDTree(keys);processed=[];known=[]
        for prim in mesh['primitives']:
            pos=glb.read(prim['attributes']['POSITION']);uv=glb.read(prim['attributes']['TEXCOORD_0']);uv[:,1]=1-uv[:,1];distance,key_ids=tree.query(uv)
            assert distance.max()<1e-6,(name,distance.max())
            candidates=[sorted(uvmap[keys[i]]) for i in key_ids]
            for i,ids in enumerate(candidates):
                if len(ids)==1:known.append((source[ids[0]],pos[i]))
            processed.append((prim,pos,distance,candidates))
        # The transparent eye shell reuses UVs. Fit the exact unambiguous source
        # landmarks separately per eye, then resolve those duplicated UVs spatially.
        affines={}
        for side in [-1,1]:
            k=[(a,b) for a,b in known if (a[0]>=0)==(side==1)]
            if len(k)>=4:
                a=np.c_[np.array([p[0] for p in k]),np.ones(len(k))];b=np.array([p[1] for p in k]);affines[side]=np.linalg.lstsq(a,b,rcond=None)[0]
        for prim,pos,distance,candidates in processed:
            remap=[]
            for i,ids in enumerate(candidates):
                if len(ids)==1:remap.append(ids[0]);continue
                def error(k):
                    side=1 if source[k,0]>=0 else -1
                    return np.linalg.norm(np.r_[source[k],1]@affines[side]-pos[i])
                remap.append(min(ids,key=error))
            remap=np.array(remap);tri=glb.read(prim['indices']).astype(int).reshape(-1,3);n0=normals(pos,tri,remap)
            for target,delta in targets.items():
                proxy_delta=delta if bind is None else (delta[bind[0]]*bind[1][:,:,None]).sum(1)
                move=proxy_delta[remap];dn=normals(pos+move,tri,remap)-n0
                prim['targets'].append({'POSITION':glb.morph(move),'NORMAL':glb.morph(dn)})
            report['meshes'].append({'mesh':name,'vertices':len(pos),'maxUVError':float(distance.max()),'spatiallyResolvedUVs':sum(len(c)>1 for c in candidates)})
        mesh['extras']['targetNames'].extend(targets);mesh['weights']=[0.]*len(mesh['extras']['targetNames'])
    j.setdefault('extras',{})['expressionSource']={'author':'Mika Suominen / MakeHuman Community','license':'CC0-1.0','source':'https://static.makehumancommunity.org/assets/assetpacks/faceunits01.html','mapping':'Exact source OBJ UV correspondence; MHClO barycentric binding for facial accessories','units':'metres'}
    args.output.parent.mkdir(parents=True,exist_ok=True);glb.save(args.output)
    report['outputSHA256']=hashlib.sha256(args.output.read_bytes()).hexdigest();report['outputBytes']=args.output.stat().st_size
    (args.output.parent/'expression-transfer-report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))
if __name__=='__main__':main()
