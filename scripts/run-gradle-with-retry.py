#!/usr/bin/env python3
"""Retry the observed Foojay plugin lookup outage without retrying code/test failures."""
from collections import deque
import subprocess
import sys
import time


def execute(command):
    tail = deque(maxlen=10000)
    with subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                          text=True) as process:
        for line in process.stdout:
            print(line, end="", flush=True)
            tail.append(line)
        return process.wait(), "".join(tail)


def run(command, execute_command=execute, sleep=time.sleep):
    for attempt in range(1, 4):
        code, output = execute_command(command)
        if code == 0:
            return 0
        lookup_failure = (
            "Plugin [id: 'org.gradle.toolchains.foojay-resolver-convention', version: '1.0.0']"
            in output and "was not found in any of the following sources" in output
        )
        if not lookup_failure or attempt == 3:
            return code
        print(f"Foojay 1.0.0 lookup failed; retrying Gradle ({attempt + 1}/3).", flush=True)
        sleep(attempt * 5)
    raise AssertionError("Unreachable retry state")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Usage: run-gradle-with-retry.py COMMAND [ARGS...]")
    raise SystemExit(run(sys.argv[1:]))
