#!/usr/bin/env python3
"""Check the real inventory init script against an isolated Gradle composite build."""
import argparse
import json
from pathlib import Path
import subprocess
import tempfile


def check(wrapper, init_script):
    with tempfile.TemporaryDirectory(prefix="bebbo-inventory-scope-") as directory:
        project = Path(directory)
        (project / "app").mkdir()
        included = project / "build-logic"
        included.mkdir()
        (project / "settings.gradle").write_text(
            "rootProject.name = 'inventory-scope'\n"
            "include ':app'\nincludeBuild 'build-logic'\n"
        )
        (included / "settings.gradle").write_text("rootProject.name = 'build-logic'\n")
        (included / "build.gradle").write_text("")
        (project / "app/build.gradle").write_text("")
        (project / "build.gradle").write_text(
            "tasks.register('verifyInventoryScope') {\n"
            "  dependsOn gradle.includedBuild('build-logic').task(':help')\n"
            "  doLast {\n"
            "    assert project(':app').tasks.findByName('reviewDependencyInventory') != null\n"
            "    println 'INVENTORY_SCOPE_OK'\n"
            "  }\n}\n"
        )
        process = subprocess.run(
            [str(wrapper), "--project-dir", str(project), "--init-script", str(init_script),
             "verifyInventoryScope", "--offline", "--no-daemon", "--max-workers=2",
             "--console=plain"],
            text=True, capture_output=True, timeout=300,
        )
        if process.returncode or "INVENTORY_SCOPE_OK" not in process.stdout:
            raise RuntimeError("Composite-build inventory scope failed:\n"
                               + process.stdout + process.stderr)
    return {"result": "PASS", "scope": "Real Gradle init script registers the app task "
            "and safely configures an included build without an :app project. "
            "No Android SDK, network dependency or device is used."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--wrapper", type=Path, default=Path("android/gradlew"))
    parser.add_argument("--init-script", type=Path,
                        default=Path("scripts/android-dependency-inventory.gradle"))
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    report = check(args.wrapper.resolve(), args.init_script.resolve())
    text = json.dumps(report, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
