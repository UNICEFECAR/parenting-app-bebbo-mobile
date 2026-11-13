"""Check packaged C++ runtimes and 16 KB ELF alignment in an unsigned AAB."""
import argparse
import collections
import json
import struct
import zipfile
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


def inspect(bundle):
    libraries, problems = [], []
    with zipfile.ZipFile(bundle) as archive:
        names = [name for name in archive.namelist() if name.startswith('base/lib/') and name.endswith('.so')]
        abis = sorted({name.split('/')[2] for name in names})
        if not abis:
            problems.append('Bundle contains no native libraries')
        counts = collections.Counter(names)
        for abi in abis:
            if counts[f'base/lib/{abi}/libc++_shared.so'] != 1:
                problems.append(f'{abi}: expected exactly one libc++_shared.so')
        for name in names:
            abi = name.split('/')[2]
            alignments = load_alignments(archive.read(name))
            valid = bool(alignments) and all(alignment >= 16384 and congruent for alignment, congruent in alignments)
            libraries.append({'path': name, 'minimum_load_alignment': min((a for a, _ in alignments), default=0), 'supports_16kb': valid})
            if abi in ('arm64-v8a', 'x86_64') and not valid:
                problems.append(f'{name}: incompatible 16 KB load segments')
    return {'bundle': str(bundle), 'abis': abis, 'libraries': libraries, 'problems': problems}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('bundle', type=Path)
    parser.add_argument('--report', type=Path, required=True)
    args = parser.parse_args()
    result = inspect(args.bundle)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))
    raise SystemExit(bool(result['problems']))
