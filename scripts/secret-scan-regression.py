"""Exercise the real pinned scanner on disposable commits; never use a real credential."""
import os, pathlib, random, string, subprocess, sys, tempfile

script = str(pathlib.Path(__file__).with_name('scan-new-secrets.sh').resolve())
binary = str(pathlib.Path(sys.argv[1]).resolve())
with tempfile.TemporaryDirectory(prefix='bebbo-secret-scan-') as temp:
    def run(args, **kwargs):
        return subprocess.run(args, cwd=temp, check=True, capture_output=True, text=True, **kwargs)
    run(['git', 'init', '-q'])
    run(['git', 'config', 'user.name', 'Security regression fixture'])
    run(['git', 'config', 'user.email', 'fixture@example.invalid'])
    file = pathlib.Path(temp) / 'settings.txt'
    file.write_text('ordinary configuration\n')
    run(['git', 'add', '.']); run(['git', 'commit', '-qm', 'baseline'])
    base = run(['git', 'rev-parse', 'HEAD']).stdout.strip()
    file.write_text('ordinary changed configuration\n')
    run(['git', 'add', '.']); run(['git', 'commit', '-qm', 'benign change'])
    env = {**os.environ, 'GITLEAKS_BASE': base, 'GITLEAKS_BIN': binary}
    env.pop('GITLEAKS_SELF_TEST', None)
    clean = run(['bash', script], env=env)
    assert 'no leaks found' in clean.stderr.lower()
    # Deterministic fabricated syntax, with no corresponding account/token.
    token = 'ghp_' + ''.join(random.Random(126).choices(string.ascii_letters + string.digits, k=36))
    file.write_text('github_token=' + token + '\n')
    run(['git', 'add', '.']); run(['git', 'commit', '-qm', 'synthetic credential'])
    flagged = subprocess.run(['bash', script], cwd=temp, env=env, capture_output=True, text=True)
    assert flagged.returncode == 1, 'Synthetic credential must fail the gate'
    output = flagged.stdout + flagged.stderr
    assert token not in output, 'Scanner must redact matched values'
    assert 'leaks found' in output.lower()
print('Scanner regression passed: benign commits accepted, synthetic token rejected and redacted')
