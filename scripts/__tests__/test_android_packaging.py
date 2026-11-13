"""Exercise the ABI, ELF and bundle-to-device packaging release guards."""
import importlib.util
import io
import struct
import tempfile
import unittest
import warnings
import zipfile
from pathlib import Path


def module(name, filename):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).resolve().parents[1] / filename)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


bundlecheck = module('bundlecheck', 'check-android-bundle.py')
splitcheck = module('splitcheck', 'check-android-splits.py')


def elf(bits=64, alignment=16384, offset=0, address=0, endian='<'):
    data = bytearray(160)
    data[:6] = b'\x7fELF' + bytes([2 if bits == 64 else 1, 1 if endian == '<' else 2])
    if bits == 64:
        struct.pack_into(endian + 'Q', data, 32, 64)
        struct.pack_into(endian + 'HH', data, 54, 56, 1)
        struct.pack_into(endian + 'IIQQQQQQ', data, 64, 1, 5, offset, address, 0, 100, 100, alignment)
    else:
        struct.pack_into(endian + 'I', data, 28, 52)
        struct.pack_into(endian + 'HH', data, 42, 32, 1)
        struct.pack_into(endian + 'IIIIIIII', data, 52, 1, offset, address, 0, 100, 100, 5, alignment)
    return bytes(data)


class AndroidPackaging(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.folder = Path(self.temp.name)

    def bundle(self, entries=None):
        target = self.folder / 'app.aab'
        with warnings.catch_warnings(), zipfile.ZipFile(target, 'w') as archive:
            warnings.simplefilter('ignore', UserWarning)
            for name, data in entries if entries is not None else [('base/lib/arm64-v8a/libc++_shared.so', elf())]:
                archive.writestr(name, data)
        return target

    def manifest(self, extract='true', target='37'):
        file = self.folder / 'manifest.xml'
        file.write_text(f'<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="org.test"><uses-sdk android:targetSdkVersion="{target}"/><application android:extractNativeLibs="{extract}"/></manifest>')
        return file

    def splits(self, entries, compressed=True):
        target = self.folder / 'app.apks'
        with zipfile.ZipFile(target, 'w') as archive:
            for index, names in enumerate(entries):
                buffer = io.BytesIO()
                with zipfile.ZipFile(buffer, 'w', compression=zipfile.ZIP_DEFLATED if compressed else zipfile.ZIP_STORED) as apk:
                    for name in names:
                        apk.writestr(f'lib/x86_64/{name}', elf())
                archive.writestr(f'splits/part{index}.apk', buffer.getvalue())
        return target

    def test_elf64(self):
        self.assertEqual(bundlecheck.load_alignments(elf()), [(16384, True)])

    def test_elf32(self):
        self.assertEqual(bundlecheck.load_alignments(elf(32, 4096)), [(4096, True)])

    def test_big_endian_elf(self):
        self.assertEqual(bundlecheck.load_alignments(elf(endian='>')), [(16384, True)])

    def test_invalid_elf(self):
        with self.assertRaises(ValueError):
            bundlecheck.load_alignments(b'not an ELF library')

    def test_64_bit_bundle(self):
        self.assertFalse(bundlecheck.inspect(self.bundle())['problems'])

    def test_missing_cpp_runtime(self):
        self.assertTrue(bundlecheck.inspect(self.bundle([('base/lib/arm64-v8a/libapp.so', elf())]))['problems'])

    def test_duplicate_cpp_runtime(self):
        self.assertTrue(bundlecheck.inspect(self.bundle([('base/lib/arm64-v8a/libc++_shared.so', elf())] * 2))['problems'])

    def test_empty_bundle(self):
        self.assertTrue(bundlecheck.inspect(self.bundle([]))['problems'])

    def test_4kb_64_bit_library_is_rejected(self):
        self.assertTrue(bundlecheck.inspect(self.bundle([('base/lib/x86_64/libc++_shared.so', elf(alignment=4096))]))['problems'])

    def test_incongruent_load_address_is_rejected(self):
        self.assertTrue(bundlecheck.inspect(self.bundle([('base/lib/arm64-v8a/libc++_shared.so', elf(offset=100))]))['problems'])

    def test_32_bit_4kb_alignment_is_allowed(self):
        self.assertFalse(bundlecheck.inspect(self.bundle([('base/lib/armeabi-v7a/libc++_shared.so', elf(32, 4096))]))['problems'])

    def test_missing_requested_abi_is_rejected(self):
        self.assertTrue(bundlecheck.inspect(self.bundle(), ['arm64-v8a', 'x86_64'])['problems'])

    def test_manifest_policy(self):
        for extract, target, valid in [('true', '37', True), ('false', '37', False), ('true', '36', False)]:
            with self.subTest(extract=extract, target=target):
                result = bundlecheck.inspect(self.bundle(), ['arm64-v8a'], self.manifest(extract, target))
                self.assertEqual(not result['problems'], valid)

    def test_device_native_splits(self):
        self.assertFalse(splitcheck.inspect(self.splits([['libc++_shared.so', 'libapp.so']]))['problems'])

    def test_device_splits_must_extract_libraries(self):
        self.assertTrue(splitcheck.inspect(self.splits([['libc++_shared.so']], compressed=False))['problems'])

    def test_device_splits_require_cpp_runtime(self):
        self.assertTrue(splitcheck.inspect(self.splits([['libapp.so']]))['problems'])

    def test_duplicate_runtime_across_splits_is_rejected(self):
        self.assertTrue(splitcheck.inspect(self.splits([['libc++_shared.so'], ['libc++_shared.so']]))['problems'])

    def test_empty_device_splits_are_rejected(self):
        self.assertTrue(splitcheck.inspect(self.splits([]))['problems'])


if __name__ == '__main__':
    unittest.main()
