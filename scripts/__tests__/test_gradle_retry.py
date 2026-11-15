import contextlib
import io
import runpy
import unittest

run_gradle = runpy.run_path("scripts/run-gradle-with-retry.py")["run"]
LOOKUP_FAILURE = (
    "Plugin [id: 'org.gradle.toolchains.foojay-resolver-convention', version: '1.0.0'] "
    "was not found in any of the following sources"
)


class GradleRetry(unittest.TestCase):
    def invoke(self, outcomes):
        calls = []
        waits = []

        def execute(command):
            calls.append(command)
            return outcomes[len(calls) - 1]

        with contextlib.redirect_stdout(io.StringIO()):
            code = run_gradle(["gradle", "verify"], execute, waits.append)
        return code, calls, waits

    def test_success_never_retries(self):
        code, calls, waits = self.invoke([(0, "BUILD SUCCESSFUL")])
        self.assertEqual((code, len(calls), waits), (0, 1, []))

    def test_only_observed_lookup_failure_can_recover(self):
        code, calls, waits = self.invoke([(1, LOOKUP_FAILURE), (0, "BUILD SUCCESSFUL")])
        self.assertEqual((code, len(calls), waits), (0, 2, [5]))

    def test_persistent_lookup_failure_remains_a_failure(self):
        code, calls, waits = self.invoke([(1, LOOKUP_FAILURE)] * 3)
        self.assertEqual((code, len(calls), waits), (1, 3, [5, 10]))

    def test_compilation_test_and_other_lookup_errors_are_not_retried(self):
        for message in ("Compilation failed", "There were failing tests",
                        "Plugin [id: 'unknown'] was not found in any of the following sources"):
            with self.subTest(message=message):
                code, calls, waits = self.invoke([(2, message)])
                self.assertEqual((code, len(calls), waits), (2, 1, []))
