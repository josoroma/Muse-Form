#!/usr/bin/env python3
"""Check portable native SVG structure; not an artistic-quality evaluator."""
import json
import argparse
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

def check(path):
    errors = []
    try:
        root = ET.parse(path).getroot()
    except (ET.ParseError, OSError) as exc:
        return {"file": str(path), "pass": False, "errors": [str(exc)]}
    local = lambda name: name.split('}')[-1]
    if local(root.tag) != 'svg': errors.append('Root must be svg')
    if not root.get('viewBox'): errors.append('Missing viewBox')
    tags = [local(el.tag) for el in root.iter()]
    for tag in ('title', 'desc'):
        if tag not in tags: errors.append(f'Missing {tag}')
    ids = [el.get('id') for el in root.iter() if el.get('id')]
    if len(set(ids)) != len(ids): errors.append('Duplicate IDs')
    animations = []
    for el in root.iter():
        tag = local(el.tag)
        if tag in ('script', 'foreignObject', 'image', 'filter', 'linearGradient', 'radialGradient', 'text'):
            errors.append(f'Unsupported non-native or active element: {tag}')
        if tag in ('animate', 'animateTransform', 'animateMotion'):
            animations.append(el)
            if el.get('dur') != '5s': errors.append('Animation duration must be 5s')
            if el.get('repeatCount') != 'indefinite': errors.append('Corpus loops must repeat indefinitely')
        for name, value in el.attrib.items():
            name = local(name)
            if name.lower().startswith('on'): errors.append(f'Event handler: {name}')
            if name == 'href' and not value.startswith('#'): errors.append(f'External asset: {value}')
            if name == 'href' and value.startswith('#') and value[1:] not in ids: errors.append(f'Broken reference: {value}')
            for target in re.findall(r'url\([\s\"\']*([^\)\"\'\s]+)', value):
                if not target.startswith('#'): errors.append(f'External URL: {target}')
                elif target[1:] not in ids: errors.append(f'Broken reference: {target}')
    return {"file": str(path), "pass": not errors, "paths": tags.count('path'), "animations": len(animations), "errors": errors}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('files', nargs='+', help='Static or five-second animated SVG files to inspect')
    args = parser.parse_args()
    reports = [check(Path(path)) for path in args.files]
    print(json.dumps(reports, indent=2))
    sys.exit(0 if all(r['pass'] for r in reports) else 1)
