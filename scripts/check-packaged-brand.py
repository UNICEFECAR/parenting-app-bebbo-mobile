"""Check app-owned file paths and the shipped launch animation in a release."""
import argparse
from pathlib import Path
from zipfile import ZipFile

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

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('flavour', choices=ANDROID)
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument('--android', type=Path)
    g.add_argument('--ios-app', type=Path)
    p.add_argument('--development', action='store_true')
    a = p.parse_args()
    if a.android:
        variant = ANDROID[a.flavour] + ('staging' if a.development else '')
        source = ROOT / 'android/app/src' / variant / 'res/raw/splash.json'
        expected = source.read_bytes()
        with ZipFile(a.android) as package:
            verify(a.flavour, package.namelist())
            # Release shrinking may shorten resource paths. Match the original bytes.
            if not any(f.file_size == len(expected) and package.read(f) == expected for f in package.infolist()):
                raise ValueError(f'{variant}: expected launch animation missing')
    else:
        verify(a.flavour, [str(p.relative_to(a.ios_app)) for p in a.ios_app.rglob('*')])
        source = ROOT / 'ios/LottieSplash' / IOS[a.flavour] / 'splash.json'
        if (a.ios_app / 'splash.json').read_bytes() != source.read_bytes():
            raise ValueError(f'{a.flavour}: wrong launch animation')
    print(f'{a.flavour}: instance paths and launch animation match the selected release')

if __name__ == '__main__':
    main()
