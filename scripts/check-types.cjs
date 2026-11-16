const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
function diagnostics(output) {
  const counts = {};
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^(.+)\(\d+,\d+\): error (TS\d+): (.*)$/);
    if (!match) continue;
    const key = `${match[1].replaceAll('\\', '/')} | ${match[2]} | ${match[3]}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}
function additions(current, baseline) {
  return Object.entries(current).filter(([key, count]) => count > (baseline[key] || 0));
}
if (require.main === module) {
  const baseline = require('./typescript-baseline.json');
  const result = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '--noEmit', '--pretty', 'false'], {
    cwd: path.resolve(__dirname, '..'), encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  });
  const output = result.stdout + result.stderr;
  const current = diagnostics(output);
  const extra = additions(current, baseline.diagnostics);
  if (result.error || result.signal || (result.status !== 0 && !Object.keys(current).length) || extra.length) {
    console.error(output);
    if (extra.length) console.error('New TypeScript diagnostics:', extra);
    process.exitCode = 1;
  } else {
    const count = Object.values(current).reduce((sum, value) => sum + value, 0);
    console.log(`No new TypeScript diagnostics; ${count} existing diagnostics remain (baseline ${baseline.commit}).`);
  }
}
module.exports = {diagnostics, additions};
