"""Validate Android ELF class, endianness and machine against the ABI directory."""
import struct

ABI_IDENTITIES = {'armeabi-v7a': (1, 40), 'arm64-v8a': (2, 183), 'x86': (1, 3), 'x86_64': (2, 62)}

def identity(data, abi):
    if len(data) < 20 or data[:4] != b'\x7fELF' or data[4] not in (1, 2) or data[5] not in (1, 2):
        raise ValueError('Invalid or truncated ELF header')
    machine = struct.unpack_from('<H' if data[5] == 1 else '>H', data, 18)[0]
    expected = ABI_IDENTITIES.get(abi)
    if expected is None:
        raise ValueError('Unsupported Android ABI: ' + abi)
    matches = (data[4], machine) == expected and data[5] == 1
    return {'elf_class': 64 if data[4] == 2 else 32, 'elf_machine': machine, 'matches_abi': matches}
