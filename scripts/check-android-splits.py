"""Verify the native splits actually selected for the emulator from the AAB."""
import io
import json
import sys
import zipfile
from pathlib import Path


def inspect(apks):
    libraries, problems = [], []
    with zipfile.ZipFile(apks) as archive:
        for apk in archive.namelist():
            if not apk.endswith('.apk'):
                continue
            with zipfile.ZipFile(io.BytesIO(archive.read(apk))) as package:
                for item in package.infolist():
                    if item.filename.startswith('lib/') and item.filename.endswith('.so'):
                        compressed = item.compress_type != zipfile.ZIP_STORED
                        libraries.append({'apk': apk, 'path': item.filename, 'compressed': compressed})
                        if not compressed:
                            problems.append(f'{apk}:{item.filename}: native library is not compressed')
    if not libraries:
        problems.append('No native libraries in the selected device APKs')
    runtimes = [entry for entry in libraries if entry['path'].endswith('/libc++_shared.so')]
    if len(runtimes) != 1:
        problems.append(f'Expected one C++ runtime for the selected device, found {len(runtimes)}')
    return {'abis': sorted({item['path'].split('/')[1] for item in libraries}),
            'libraries': libraries, 'problems': problems}


if __name__ == '__main__':
    result = inspect(sys.argv[1])
    Path(sys.argv[2]).write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))
    raise SystemExit(bool(result['problems']))
