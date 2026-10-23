#!/usr/bin/env python3
"""Rebuild documentary collages from pinned Git blobs, never from a mutable QA folder.
Requires Pillow. Run from any directory in a full checkout: python docs/study/build-collages.py
Only crops, scales, frames and labels actual captures; no generative or color edits.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import subprocess, io, json, hashlib, math
ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent

def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])
def font(size, serif=False):
    candidates = ([Path('/System/Library/Fonts/Supplemental/Georgia.ttf'), Path('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf')] if serif else [Path('/System/Library/Fonts/Helvetica.ttc'),Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')])
    for path in candidates:
        if path.exists(): return ImageFont.truetype(str(path), size)
    return ImageFont.load_default(size=size)
def tile(commit, path, title, note, crop=None):
    return dict(commit=commit, path=path, title=title, note=note, crop=crop)

sheets = [
 dict(file='01-medium-experiments.jpg', number='01', title='Finding a visual language', subtitle='Two studies, three media. Archived artwork from the first recorded snapshot.', cols=3, ih=384, tiles=[
  tile('f31a9f1','archive/vector-v1/corpus/posters/105232.png','Native SVG / first pass','105232 · pirate · flat color and contour'),
  tile('f31a9f1','archive/raster-v2/corpus/plates/105232.png','Raster / realism detour','105232 · pirate · generated painted plate'),
  tile('f31a9f1','archive/hairline-v3/corpus/posters/105232.png','Native SVG / Hairline return','105232 · pirate · spare contour language'),
  tile('f31a9f1','archive/vector-v1/corpus/posters/105195.png','Native SVG / first pass','105195 · ear · planes and hatching'),
  tile('f31a9f1','archive/raster-v2/corpus/plates/105195.png','Raster / realism detour','105195 · ear · tonal graphite rendering'),
  tile('f31a9f1','archive/hairline-v3/corpus/posters/105195.png','Native SVG / Hairline return','105195 · ear · reduced structural lines'),
 ]),
 dict(file='02-five-second-motion.jpg',number='02',title='A drawing has to move',subtitle='Authored rest and peak captures from the five-second SVG revision.',cols=2,ih=460,tiles=[
  tile('d73c45d','qa/motion-five/105196-rest.png','A quiet smile / rest','105196 · 22 Oct 2026'),
  tile('d73c45d','qa/motion-five/105196-peak.png','A quiet smile / peak','105196 · coordinated facial change'),
  tile('d73c45d','qa/motion-five/105216-rest.png','The palm opens / rest','105216 · 22 Oct 2026'),
  tile('d73c45d','qa/motion-five/105216-peak.png','The palm opens / peak','105216 · articulated finger movement'),
 ]),
 dict(file='03-threejs-evolution.jpg',number='03',title='From constructed parts to one character',subtitle='Actual browser captures. FORM studies movement; MUSE studies expression.',cols=2,ih=490,tiles=[
  tile('03e6a29','qa/three/body-rest.png','FORM / procedural anatomy','03e6a29 · 22 Oct 2026', [36,241,969,961]),
  tile('6ee937f','qa/expressions/joy-front-rest.png','MUSE / procedural portrait','6ee937f · 23 Oct 2026'),
  tile('53763f4','qa/three/body-front-rest.png','FORM / shared skinned mesh','53763f4 · 23 Oct 2026'),
  tile('53763f4','qa/expressions/joy-front-rest.png','MUSE / the same adult identity','53763f4 · 23 Oct 2026'),
 ]),
 dict(file='04-portrait-refinement.jpg',number='04',title='Review the face at portrait scale',subtitle='Same neutral pose and camera. Left: before the complexion repair. Right: final revision.',cols=2,ih=480,tiles=[
  tile('6b21c15','qa/character/portrait-v6/before-joy-front.png','Before / front','Archived runtime · gray albedo patches', [340,100,1200,850]),
  tile('6b21c15','qa/character/portrait-v6/final-joy-front.png','After / front','Clean complexion · softened facial contour', [340,100,1200,850]),
  tile('6b21c15','qa/character/portrait-v6/before-joy-quarter.png','Before / three-quarter','Archived runtime · broad cheek and jaw shading', [340,100,1200,850]),
  tile('6b21c15','qa/character/portrait-v6/final-joy-quarter.png','After / three-quarter','Warmer fill · continuous face-to-neck color', [340,100,1200,850]),
  tile('6b21c15','qa/character/portrait-v6/before-joy-side.png','Before / profile','Archived runtime · same camera', [340,100,1200,850]),
  tile('6b21c15','qa/character/portrait-v6/final-joy-side.png','After / profile','Retained chin projection and lip volume', [340,100,1200,850]),
 ]),
 dict(file='05-mouth-and-normals.jpg',number='05',title='Fix the cause, then compare the same pose',subtitle='Matched crops from browser captures. The last row isolates shading, not expression strength.',cols=2,ih=390,tiles=[
  tile('6b21c15','qa/character/portrait-v6/before-surprise-front.png','Surprise / before','Tongue fills the opening; lower teeth dominate', [530,420,1035,775]),
  tile('6b21c15','qa/character/portrait-v6/final-surprise-front.png','Surprise / after','Upper incisors align; tongue sits deeper', [530,420,1035,775]),
  tile('6b21c15','qa/character/portrait-v6/before-laughter-quarter.png','Laughter / before','Earlier dental placement and oral shading', [420,380,1030,780]),
  tile('6b21c15','qa/character/portrait-v6/final-laughter-quarter.png','Laughter / after','Aligned arches; darker mouth interior', [420,380,1030,780]),
  tile('6b21c15','qa/character/oral-v2/diagnostic-smile-normal-before.png','Identical smile / additive normals','Diagnostic baseline · same posed vertices', [230,210,650,530]),
  tile('6b21c15','qa/character/oral-v2/diagnostic-smile-normal-after.png','Identical smile / evaluated normals','Diagnostic correction · false cheek wedge removed', [230,210,650,530]),
 ]),
]

manifest = dict(schemaVersion=1, generated='2026-10-23', description='Documentary collages made only from committed artwork and browser renders. No recoloring or generated replacement images.', repositoryHead=git('rev-parse','6b21c15').decode().strip(), chronologyNote='The first commit already contains vector-v1, raster-v2 and hairline-v3 archives; their order comes from archive descriptions, not distinct dated commits.', reproduce='python docs/study/build-collages.py (Pillow and full Git history required)', collages=[])
BG='#101919'; CARD='#192323'; RULE='#344340'; WHITE='#f3f0e7'; MUTED='#a4b3ad'; MINT='#a2e0cf'
W=1800; PAD=56; GAP=24; TOP=184; FOOT=75
for sheet in sheets:
    cols=sheet['cols']; cw=(W-2*PAD-(cols-1)*GAP)//cols; ih=sheet['ih']; ch=ih+112; rows=math.ceil(len(sheet['tiles'])/cols)
    im=Image.new('RGB',(W,TOP+rows*ch+(rows-1)*GAP+FOOT),BG); d=ImageDraw.Draw(im)
    d.text((PAD,35),'FORM / MUSE     DEVELOPMENT STUDY',font=font(21),fill=MINT)
    d.text((PAD,72),sheet['title'],font=font(48,True),fill=WHITE)
    d.text((PAD,135),sheet['subtitle'],font=font(22),fill=MUTED)
    entry={k:sheet[k] for k in ['file','number','title','subtitle']};entry['tiles']=[]
    for n,t in enumerate(sheet['tiles']):
        full=git('rev-parse',t['commit']).decode().strip(); data=git('show',full+':'+t['path']); source=Image.open(io.BytesIO(data)).convert('RGB'); source_size=source.size
        if t['crop']: source=source.crop(t['crop'])
        x=PAD+(n%cols)*(cw+GAP); y=TOP+(n//cols)*(ch+GAP)
        d.rectangle((x,y,x+cw,y+ch),fill=CARD)
        source=ImageOps.contain(source,(cw,ih),Image.Resampling.LANCZOS)
        d.rectangle((x,y,x+cw,y+ih),fill='#101415')
        im.paste(source,(x+(cw-source.width)//2,y+(ih-source.height)//2))
        d.line((x,y+ih,x+cw,y+ih),fill=RULE,width=1)
        d.text((x+20,y+ih+17),t['title'],font=font(27),fill=WHITE)
        d.text((x+20,y+ih+59),t['note'],font=font(20),fill=MUTED)
        entry['tiles'].append({**t,'commit':full,'commitDate':git('show','-s','--format=%aI',full).decode().strip(),'sourceSize':source_size,'sha256':hashlib.sha256(data).hexdigest(),'processing':'Crop (if listed), proportional scale, layout and text only. Source colors unchanged.'})
    d.text((PAD,im.height-43),'ACTUAL ARCHIVED OUTPUT  /  Sources and crops: docs/study/sources.json',font=font(19),fill=MUTED)
    d.text((W-PAD-38,im.height-47),sheet['number'],font=font(25),fill=MINT)
    im.save(OUT/sheet['file'],quality=92,optimize=True,subsampling=0)
    entry['outputSize']=im.size;entry['outputSha256']=hashlib.sha256((OUT/sheet['file']).read_bytes()).hexdigest();manifest['collages'].append(entry)
(OUT/'sources.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Created',len(sheets),'collages with pinned source provenance.')
