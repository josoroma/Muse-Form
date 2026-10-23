"""Bundle the offline 3D explorer and its unchanged companion SVG gallery."""
from pathlib import Path
import json, zipfile

ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'exports/form-and-muse-threejs.zip'
out.parent.mkdir(exist_ok=True)
folders=['three','expressions','corpus/svg','corpus/animated','runtime','skills/seven-second-storytelling','archive/procedural-v3','archive/skinned-v4-before-face-refinement','archive/skinned-v5-before-complexion']
files=['index.html','gallery.mjs','style.css','corpus/manifest.json','scripts/serve.mjs',
       'scripts/build-three.mjs','scripts/build-character-expressions.py','scripts/catalog-three.mjs','scripts/check-three.mjs',
       'scripts/playback-three.mjs','scripts/bundle-three.py','package-lock.json',
       'scripts/catalog-expressions.mjs','scripts/check-expressions.mjs','scripts/playback-expressions.mjs','scripts/check-hair-subdivision.mjs',
       'qa/character/cross-view.json','qa/character/materials/review.json','qa/character/subdivision/asset-checks.json','qa/character/subdivision/synthetic-checks.json',
       'qa/character/face-refinement/review.json','qa/character/dental-refinement/review.json',
       'qa/character/complexion/review.json','qa/character/oral-v2/review.json','qa/character/portrait-v6/review.json',
       'qa/three/checks.json','qa/three/playback.json','qa/three/art-review.json','qa/three/hand-peak.png','qa/three/foot-peak.png',
       'qa/expressions/checks.json','qa/expressions/playback.json','qa/expressions/art-review.json','qa/expressions/laughter-front-peak.png','qa/expressions/surprise-side-peak.png',
       ]
package=json.loads((ROOT/'package.json').read_text())
package['scripts']={k:v for k,v in package['scripts'].items() if k=='start' or k.endswith((':three',':expressions'))}
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for folder in folders:
        for p in sorted((ROOT/folder).rglob('*')):
            if p.is_file() and '__pycache__' not in p.parts:
                if p in [ROOT/'three/README.md',ROOT/'expressions/README.md']:
                    archive.writestr(str(p.relative_to(ROOT)),p.read_text().replace(' · [Portable source bundle](../exports/form-and-muse-threejs.zip)',''))
                else: archive.write(p,p.relative_to(ROOT))
    for file in files: archive.write(ROOT/file,file)
    archive.writestr('package.json',json.dumps(package,indent=2)+'\n')
    archive.writestr('README.md','# FORM + MUSE — Anatomy and expression\n\nRun `npm start` (Node.js 22+) and open http://127.0.0.1:4173/expressions/ for MUSE or http://127.0.0.1:4173/three/ for FORM. All browser dependencies are included locally. The original SVG gallery is available at http://127.0.0.1:4173/.\n\nSee [the anatomy prompts and source](three/README.md), [facial-expression prompts](expressions/README.md), [anatomy review](qa/three/art-review.json), and [portrait review](qa/expressions/art-review.json). No MP4 files are included.\n')
with zipfile.ZipFile(out) as archive:
    assert archive.testzip() is None
    assert not any(n.endswith('.mp4') for n in archive.namelist())
    assert len([n for n in archive.namelist() if n.startswith('corpus/') and n.endswith('.svg')])==48
print(f'Packaged {out.name} ({out.stat().st_size:,} bytes); local Three.js plus 48 preserved SVGs.')
