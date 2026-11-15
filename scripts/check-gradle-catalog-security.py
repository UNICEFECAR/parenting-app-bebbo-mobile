#!/usr/bin/env python3
"""Exercise Gradle's catalog validation without resolving app dependencies."""
import argparse
import json
from pathlib import Path
import subprocess
import tempfile


def check(wrapper):
    results = []
    with tempfile.TemporaryDirectory(prefix="bebbo-gradle-catalog-") as directory:
        for label, version in [("valid", "1.0"), ("invalid", "1.0*/")]:
            project = Path(directory) / label
            project.mkdir()
            # The invalid value contains no executable payload. It must be rejected
            # by catalog validation, rather than reaching generated Java compilation.
            (project / "settings.gradle").write_text(
                "rootProject.name = 'catalog-validation'\n"
                "dependencyResolutionManagement { versionCatalogs { libs {\n"
                f"version('sample', '{version}')\n"
                "library('sample', 'org.example', 'unused').versionRef('sample')\n"
                "} } }\n"
            )
            (project / "build.gradle").write_text(
                "plugins { id 'java-library' }\n"
                "def sampleVersion = libs.versions.sample.get()\n"
            )
            process = subprocess.run(
                [str(wrapper), "--project-dir", str(project), "help", "--no-daemon",
                 "--max-workers=2", "--console=plain"],
                text=True, capture_output=True, timeout=300,
            )
            output = process.stdout + process.stderr
            if label == "valid" and process.returncode:
                raise RuntimeError("The valid control build failed:\n" + output)
            if label == "invalid" and not (
                process.returncode and "catalog" in output.lower()
                and "*/" in output and "not allowed" in output.lower()
            ):
                raise RuntimeError("Unsafe catalog value was not rejected by validation:\n" + output)
            results.append({"case": label, "exit_code": process.returncode,
                            "result": "PASS"})
    return {"scope": "Isolated version-catalog validation; not an exploit or app/device test",
            "results": results}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--wrapper", type=Path, default=Path("android/gradlew"))
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    report = check(args.wrapper.resolve())
    text = json.dumps(report, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
