"""Check packaged C++ runtimes and 16 KB ELF alignment in an unsigned AAB."""
from android_elf import identity
import argparse
import collections
import json
import struct
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


def load_alignments(data):
    if data[:4] != b'\x7fELF':
        raise ValueError('Not an ELF library')
    endian = '<' if data[5] == 1 else '>'
    is_64 = data[4] == 2
    offset = struct.unpack_from(endian + ('Q' if is_64 else 'I'), data, 32 if is_64 else 28)[0]
    size, count = struct.unpack_from(endian + 'HH', data, 54 if is_64 else 42)
    result = []
    for index in range(count):
        item = struct.unpack_from(endian + ('IIQQQQQQ' if is_64 else 'IIIIIIII'), data, offset + index * size)
        if item[0] == 1:
            file_offset, address, alignment = (item[2], item[3], item[7]) if is_64 else (item[1], item[2], item[7])
            result.append((alignment, (address - file_offset) % 16384 == 0))
    return result


def inspect(bundle, expected_abis=None, manifest=None, expected_target_sdk=37):
    libraries, problems = [], []
    with zipfile.ZipFile(bundle) as archive:
        names = [name for name in archive.namelist() if name.startswith('base/lib/') and name.endswith('.so')]
        abis = sorted({name.split('/')[2] for name in names})
        if not abis:
            problems.append('Bundle contains no native libraries')
        if expected_abis is not None and abis != sorted(expected_abis):
            problems.append(f'Expected ABIs {sorted(expected_abis)}, packaged {abis}')
        counts = collections.Counter(names)
        for abi in abis:
            if counts[f'base/lib/{abi}/libc++_shared.so'] != 1:
                problems.append(f'{abi}: expected exactly one libc++_shared.so')
        for name in names:
            abi = name.split('/')[2]
            data = archive.read(name)
            try:
                elf_identity = identity(data, abi)
                alignments = load_alignments(data)
            except (ValueError, struct.error, IndexError):
                problems.append(f'{name}: malformed ELF library')
                continue
            if not elf_identity['matches_abi']:
                problems.append(f'{name}: ELF class/machine does not match {abi}')
            valid = bool(alignments) and all(alignment >= 16384 and congruent for alignment, congruent in alignments)
            libraries.append({'path': name, **elf_identity, 'minimum_load_alignment': min((a for a, _ in alignments), default=0), 'supports_16kb': valid})
            if abi in ('arm64-v8a', 'x86_64') and not valid:
                problems.append(f'{name}: incompatible 16 KB load segments')
    manifest_data = None
    if manifest is not None:
        root = ET.parse(manifest).getroot()
        android = '{http://schemas.android.com/apk/res/android}'
        application, sdk = root.find('application'), root.find('uses-sdk')
        manifest_data = {
            'package': root.attrib.get('package'),
            'extract_native_libs': application.attrib.get(android + 'extractNativeLibs') if application is not None else None,
            'target_sdk': sdk.attrib.get(android + 'targetSdkVersion') if sdk is not None else None,
        }
        if manifest_data['extract_native_libs'] != 'true':
            problems.append('AAB manifest must enable native library extraction')
        if manifest_data['target_sdk'] != str(expected_target_sdk):
            problems.append(f'AAB manifest must target SDK {expected_target_sdk}')
    return {'bundle': str(bundle), 'abis': abis, 'expected_abis': expected_abis,
            'manifest': manifest_data, 'libraries': libraries, 'problems': problems}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('bundle', type=Path)
    parser.add_argument('--report', type=Path, required=True)
    parser.add_argument('--expected-abis', help='Comma-separated required ABI names')
    parser.add_argument('--manifest', type=Path, help='XML emitted by bundletool dump manifest')
    parser.add_argument('--expected-target-sdk', type=int, default=37)
    args = parser.parse_args()
    result = inspect(args.bundle, args.expected_abis.split(',') if args.expected_abis else None, args.manifest, args.expected_target_sdk)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))
    raise SystemExit(bool(result['problems']))
