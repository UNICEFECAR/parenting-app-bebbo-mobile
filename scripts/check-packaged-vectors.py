"""Compare a built target's named SVG resources with its own Metro manifest."""
import argparse
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
VECTOR = re.compile(r'[A-Za-z0-9_]+_svg_[A-Fa-f0-9]{6,}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('flavour')
    platform = parser.add_mutually_exclusive_group(required=True)
    platform.add_argument('--apk', type=Path)
    platform.add_argument('--car', type=Path)
    parser.add_argument('--aapt2', default='aapt2')
    args = parser.parse_args()
    target = 'android' if args.apk else 'ios'
    manifest = ROOT / 'app' / 'instances' / args.flavour / 'native' / f'{target}.json'
    files = json.loads(manifest.read_text())['files']
    expected = ({Path(p).stem for p in files if p.startswith('drawable/')} if args.apk else
                {p.split('.imageset/')[0] for p in files if '.imageset/' in p})
    if args.apk:
        output = subprocess.check_output([args.aapt2, 'dump', 'resources', args.apk], text=True)
        names = re.findall(r'^\s*resource\s+0x[\da-fA-F]+\s+(?:[\w.]+:)?drawable/([\w]+)', output, re.M)
    else:
        output = subprocess.check_output(['xcrun', 'assetutil', '--info', args.car], text=True)
        names = [entry.get('Name', '') for entry in json.loads(output)]
    packaged = {name for name in names if VECTOR.fullmatch(name)}
    if not expected or packaged != expected:
        raise SystemExit(f'{args.flavour} {target}: missing {sorted(expected - packaged)}, unexpected {sorted(packaged - expected)}')
    print(f'{args.flavour} {target}: {len(packaged)} packaged SVG names match the selected instance')


if __name__ == '__main__':
    main()
