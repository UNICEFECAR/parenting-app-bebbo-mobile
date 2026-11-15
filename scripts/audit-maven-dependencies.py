#!/usr/bin/env python3
"""Check fully resolved release Maven graphs and the selected Kotlin plugin with OSV."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import time
import urllib.error
import urllib.request


def packages_to_check(inventory, expected_variants=10):
    variants = inventory.get("variants", [])
    if len(variants) != expected_variants or len({v["name"] for v in variants}) != expected_variants:
        raise ValueError("The complete release variant matrix is required")
    packages = set()
    for variant in variants:
        if not variant.get("packages"):
            raise ValueError("An empty runtime graph cannot establish a clean audit")
        for package in variant["packages"]:
            coordinate = tuple(package.get(k) for k in ("group", "name", "version"))
            if not all(isinstance(v, str) and v for v in coordinate):
                raise ValueError("Incomplete Maven coordinate")
            packages.add(coordinate)
    kotlin = [p for p in inventory.get("root_buildscript", [])
              if p.get("group") == "org.jetbrains.kotlin" and p.get("name") == "kotlin-gradle-plugin"]
    if len(kotlin) != 1 or not re.fullmatch(r"\d+\.\d+\.\d+", kotlin[0]["version"]):
        raise ValueError("The resolved stable application Kotlin plugin is required")
    if tuple(map(int, kotlin[0]["version"].split("."))) < (2, 4, 20):
        raise ValueError("The resolved Kotlin plugin predates the KAPT deserialisation fix")
    packages.add((kotlin[0]["group"], kotlin[0]["name"], kotlin[0]["version"]))
    return sorted(packages)


def osv_query(queries):
    request = urllib.request.Request(
        "https://api.osv.dev/v1/querybatch",
        data=json.dumps({"queries": queries}).encode(),
        headers={"Content-Type": "application/json"}, method="POST",
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            if error.code != 429 and not 500 <= error.code < 600:
                raise
            if attempt == 2:
                raise
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
        time.sleep(2 ** attempt)


def audit(inventory, transport=osv_query):
    packages = packages_to_check(inventory)
    matches = []
    for start in range(0, len(packages), 100):
        batch = packages[start:start + 100]
        queries = [{"package": {"ecosystem": "Maven", "name": f"{g}:{n}"}, "version": v}
                   for g, n, v in batch]
        response = transport(queries)
        if not isinstance(response, dict) or "error" in response:
            raise ValueError("Failed OSV request; no clean result can be established")
        results = response.get("results")
        if not isinstance(results, list) or len(results) != len(batch):
            raise ValueError("Incomplete OSV response; no clean result can be established")
        for coordinate, result in zip(batch, results):
            if not isinstance(result, dict) or "error" in result or result.get("next_page_token"):
                raise ValueError("Failed or paginated OSV response requires review")
            vulns = result.get("vulns", [])
            if not isinstance(vulns, list) or any(not isinstance(v, dict) or not v.get("id") for v in vulns):
                raise ValueError("Malformed OSV finding")
            if vulns:
                matches.append({"coordinate": ":".join(coordinate),
                                "advisory_ids": sorted({v["id"] for v in vulns})})
    return {"checked_at": datetime.now(timezone.utc).isoformat(),
            "gradle_version": inventory.get("gradle_version"),
            "variants": [v["name"] for v in inventory["variants"]],
            "queried_package_versions": len(packages), "matches": matches,
            "scope": "Resolved app runtime Maven packages plus the selected root Kotlin plugin. "
                     "Excludes other buildscript dependencies, CocoaPods, C/C++ binaries, OS libraries and services."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inventory", type=Path)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    report = audit(json.loads(args.inventory.read_text()))
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    if report["matches"]:
        raise SystemExit("Resolved Maven advisory matches require review")


if __name__ == "__main__":
    main()
