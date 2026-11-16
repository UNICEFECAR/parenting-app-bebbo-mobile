import copy
import runpy
import unittest

audit_module = runpy.run_path("scripts/audit-maven-dependencies.py")


class MavenAudit(unittest.TestCase):
    def setUp(self):
        self.inventory = {
            "gradle_version": "9.9.1",
            "variants": [{"name": f"country{n}ReleaseRuntimeClasspath", "packages": [
                {"group": "com.example", "name": "runtime", "version": "1.0"}]} for n in range(10)],
            "root_buildscript": [{"group": "org.jetbrains.kotlin", "name": "kotlin-gradle-plugin", "version": "2.4.21"}],
        }

    def test_deduplicates_shared_graphs_and_checks_selected_compiler(self):
        captured = []

        def clean_response(queries):
            captured.extend(queries)
            return {"results": [{} for _ in queries]}

        report = audit_module["audit"](self.inventory, clean_response)
        self.assertEqual(report["queried_package_versions"], 2)
        self.assertEqual(report["matches"], [])
        self.assertEqual(len(captured), 2)

    def test_preserves_advisory_matches_for_review(self):
        report = audit_module["audit"](self.inventory, lambda queries: {
            "results": [{"vulns": [{"id": "TEST-1"}]} for _ in queries]})
        self.assertEqual(len(report["matches"]), 2)
        self.assertEqual(report["matches"][0]["advisory_ids"], ["TEST-1"])

    def test_incomplete_or_unpatched_inventory_cannot_pass(self):
        for change in ("missing_variant", "empty_graph", "old_compiler"):
            inventory = copy.deepcopy(self.inventory)
            if change == "missing_variant":
                inventory["variants"].pop()
            elif change == "empty_graph":
                inventory["variants"][0]["packages"] = []
            else:
                inventory["root_buildscript"][0]["version"] = "2.2.10"
            with self.subTest(change=change), self.assertRaises(ValueError):
                audit_module["packages_to_check"](inventory)

    def test_partial_failed_or_paginated_osv_responses_cannot_pass(self):
        for response in ({"results": []}, {"results": [{"error": "unavailable"}] * 2},
                         {"results": [{"next_page_token": "more"}] * 2}):
            with self.subTest(response=response), self.assertRaises(ValueError):
                audit_module["audit"](self.inventory, lambda _queries: response)
