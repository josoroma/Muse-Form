"""Package the current MUSE + FORM product, without historical editions."""
from pathlib import Path, PurePosixPath
import json
import posixpath
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'dist/muse-form.zip'

# Keep one runtime copy. Historical geometry, SVGs and generated skill copies
# belong to the repository archive, never to the portable application.
FILES = {
    'index.html', 'README.md', 'README-STUDY.md', 'README-STUDY-MUSE.md', 'README-STUDY-FORM.md',
    'AGENTS.md', 'package.json', 'package-lock.json', '.github/workflows/pages.yml',
    'three/index.html', 'three/app.mjs', 'three/style.css', 'three/geometry.mjs',
    'three/README.md', 'three/SOURCES.md', 'three/manifest.json',
    'expressions/index.html', 'expressions/app.mjs', 'expressions/style.css',
    'expressions/character-face.mjs', 'expressions/facial-normals.mjs',
    'expressions/studio.mjs', 'expressions/README.md', 'expressions/SOURCES.md',
    'expressions/manifest.json',
    'scripts/serve.mjs', 'scripts/browser.mjs', 'scripts/build-three.mjs',
    'scripts/build-character-expressions.py', 'scripts/check-hair-subdivision.mjs',
    'scripts/catalog-three.mjs', 'scripts/check-three.mjs', 'scripts/playback-three.mjs',
    'scripts/catalog-expressions.mjs', 'scripts/check-expressions.mjs',
    'scripts/playback-expressions.mjs', 'scripts/bundle-three.py',
    'qa/three/checks.json', 'qa/three/playback.json', 'qa/three/art-review.json',
    'qa/expressions/checks.json', 'qa/expressions/playback.json',
    'qa/expressions/art-review.json', 'qa/character/cross-view.json',
}
FOLDERS = ('three/character', 'three/runtime', 'three/vendor', 'docs', '.agents/skills')
RETIRED_SCRIPTS = {
    'scripts/catalog.mjs', 'scripts/check.mjs', 'scripts/playback-check.mjs',
    'scripts/verify.mjs', 'scripts/compose.mjs', 'scripts/install-skill.mjs',
    'scripts/bundle.py',
}

package = json.loads((ROOT / 'package.json').read_text())
for command in package.get('scripts', {}).values():
    for script in re.findall(r'\bscripts/[\w./-]+\.(?:mjs|py)\b', command):
        if script in RETIRED_SCRIPTS:
            raise SystemExit(f'Remove the retired product command before bundling: {script}')
        FILES.add(script)
for folder in FOLDERS:
    for path in (ROOT / folder).rglob('*'):
        if path.is_file() and '__pycache__' not in path.parts and path.name != '.DS_Store':
            FILES.add(path.relative_to(ROOT).as_posix())

missing = sorted(name for name in FILES if not (ROOT / name).is_file())
if missing:
    raise SystemExit('Missing product files: ' + ', '.join(missing))


def portable_markdown(name, content):
    """Keep history readable without links to deliberately excluded files."""
    def reference(match):
        label, target = match.group(1), match.group(2)
        if re.match(r'^(?:[a-z]+:|#|//)', target, re.I):
            return match.group(0)
        raw = target.split('#', 1)[0].strip('<>')
        resolved = posixpath.normpath(posixpath.join(str(PurePosixPath(name).parent), raw))
        if resolved in FILES or any(item.startswith(resolved.rstrip('/') + '/') for item in FILES):
            return match.group(0)
        return f'{label} (repository only: `{raw}`)'

    content = re.sub(r'(?<!!)\[([^\]\n]+)\]\(([^)\n]+)\)', reference, content)
    if name in ('README.md', 'README-STUDY.md', 'README-STUDY-MUSE.md', 'README-STUDY-FORM.md'):
        content += '\n> Portable edition: historical source archives and Git history remain in the source repository. The development collages and their source manifest are included. Detailed QA frame sets are repository evidence; run the included browser checks to capture fresh frames locally.\n'
    return content


OUTPUT.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(OUTPUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
    for name in sorted(FILES):
        path = ROOT / name
        if path.suffix == '.md':
            bundle.writestr(name, portable_markdown(name, path.read_text()))
        else:
            bundle.write(path, name)

with zipfile.ZipFile(OUTPUT) as bundle:
    assert bundle.testzip() is None, 'ZIP CRC check failed'
    names = bundle.namelist()
    assert not any(n.startswith(('archive/', 'skills/', 'corpus/', 'exports/')) for n in names)
    assert not any(n.endswith('.mp4') for n in names)
    assert 'three/character/assets/adult-female-source.glb' in names
    assert 'three/character/assets/hair-long.glb' in names
    assert 'scripts/browser.mjs' in names
print(f'Packaged {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size:,} bytes): current MUSE + FORM, local assets and documentation.')
