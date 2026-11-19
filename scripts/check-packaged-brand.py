"""Check app-owned file paths and the shipped launch animation in a release."""
import argparse
import plistlib
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ANDROID = dict(bebbo='prod', bebboDev='prodstaging', foleja='xk', babuni='bangla',
               bebboPacific='bebboPacific', reraiUmntwana='reraiUmntwana',
               wawamor='wawamor', merhabaBebek='merhababebek')
IOS = dict(bebbo='Bebbo', bebboDev='Bebbo', foleja='Foleja', babuni='Babuni',
           bebboPacific='BebboPacific', reraiUmntwana='ReraiUmntwana',
           wawamor='Wawamor', merhabaBebek='MerhabaBebek')

def verify(flavour, paths):
    for path in paths:
        compact = ''.join(ch for ch in path.lower() if ch.isalnum())
        if 'appinstances' in compact:
            suffix = compact.split('appinstances', 1)[1]
            owner = next((key for key in sorted(ANDROID, key=len, reverse=True)
                          if suffix.startswith(key.lower())), None)
            if owner and owner != flavour:
                raise ValueError(f'{flavour} packaged a file from {owner}: {path}')

def check_animations(assets, expected, shipped):
    # Match bytes because Android may shorten packaged resource names.
    # Some targets deliberately share identical artwork.
    sizes = {len(data) for data in assets}
    found = set()
    for size, read in shipped:
        if size in sizes:
            data = read()
            if data in assets:
                found.add(data)
    if expected not in found:
        raise ValueError('Expected launch animation missing')
    if found - {expected}:
        raise ValueError("A different target's launch animation was also packaged")


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('flavour', choices=ANDROID)
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument('--android', type=Path)
    g.add_argument('--ios-app', type=Path)
    p.add_argument('--development', action='store_true')
    p.add_argument('--manifest', type=Path, help='Merged manifest XML from bundletool')
    p.add_argument('--ci-fixture', action='store_true', help='Verify the compile-only environment marker')
    a = p.parse_args()
    if a.manifest:
        ns = '{http://schemas.android.com/apk/res/android}'
        metadata = {entry.get(ns+'name'):entry.get(ns+'value') for entry in
                    ET.parse(a.manifest).findall('./application/meta-data')}
        if metadata.get('google_analytics_automatic_screen_reporting_enabled') != 'true':
            raise ValueError('The Android release must preserve native screen reporting')
    if a.android:
        variant = ANDROID[a.flavour] + ('staging' if a.development else '')
        source = ROOT / 'android/app/src' / variant / 'res/raw/splash.json'
        expected = source.read_bytes()
        with ZipFile(a.android) as package:
            verify(a.flavour, package.namelist())
            assets = {p.read_bytes() for p in (ROOT / 'android/app/src').glob('*/res/raw/splash.json')}
            check_animations(assets, expected, ((f.file_size, lambda: package.read(f)) for f in package.infolist()))
    else:
        verify(a.flavour, [str(p.relative_to(a.ios_app)) for p in a.ios_app.rglob('*')])
        if a.ci_fixture:
            info = plistlib.loads((a.ios_app / 'Info.plist').read_bytes())
            if info.get('FacebookDisplayName') != 'CI-' + a.flavour:
                raise ValueError(f'{a.flavour}: native environment in compiled plist does not match')
        source = ROOT / 'ios/LottieSplash' / IOS[a.flavour] / 'splash.json'
        expected = source.read_bytes()
        if (a.ios_app / 'splash.json').read_bytes() != expected:
            raise ValueError(f'{a.flavour}: wrong launch animation')
        assets = {p.read_bytes() for p in (ROOT / 'ios/LottieSplash').glob('*/splash.json')}
        files = (p for p in a.ios_app.rglob('*') if p.is_file())
        check_animations(assets, expected, ((p.stat().st_size, p.read_bytes) for p in files))
    print(f'{a.flavour}: instance paths and launch animation match the selected release')

if __name__ == '__main__':
    main()
