"""Package exactly 48 delivery SVGs, and the reusable skill separately."""
from pathlib import Path
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'corpus/manifest.json').read_text())
assert manifest['duration'] == 5 and len(manifest['studies']) == 24
exports = ROOT / 'exports'
exports.mkdir(exist_ok=True)
with zipfile.ZipFile(exports / 'storytelling-svgs.zip', 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
    for study in manifest['studies']:
        for field, folder in [('svg', 'static'), ('animated', 'animated')]:
            bundle.write(ROOT / study[field], f'{folder}/{study["id"]}.svg')
with zipfile.ZipFile(exports / 'storytelling-svgs.zip') as bundle:
    assert len(bundle.namelist()) == 48 and bundle.testzip() is None
skill = ROOT / 'skills/seven-second-storytelling'
with zipfile.ZipFile(exports / 'seven-second-storytelling.skill.zip', 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
    for path in sorted(skill.rglob('*')):
        if path.is_file() and '__pycache__' not in path.parts:
            bundle.write(path, path.relative_to(skill.parent))
print('Packaged 48 SVGs and the reusable skill. No video files included.')
