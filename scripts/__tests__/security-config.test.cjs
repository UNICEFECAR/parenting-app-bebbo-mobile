const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
test('Android wrapper cannot regress below the patched Gradle 9.8.1 baseline', () => {
  const text = fs.readFileSync('android/gradle/wrapper/gradle-wrapper.properties','utf8');
  const version = text.match(/gradle-(\d+)\.(\d+)\.(\d+)-bin.zip/).slice(1).map(Number);
  assert.ok(version[0] > 9 || (version[0] === 9 && (version[1] > 8 || (version[1] === 8 && version[2] >= 1))));
  assert.match(text,/distributionSha256Sum=[a-f0-9]{64}\n/);
});
test('every external workflow action is pinned to an immutable commit', () => {
  for(const file of fs.readdirSync('.github/workflows').filter(x=>/ya?ml$/.test(x))){
    const text=fs.readFileSync('.github/workflows/'+file,'utf8');
    for(const [,action] of text.matchAll(/\buses:\s*([^\s#]+)/g))if(!action.startsWith('./'))assert.match(action,/@[a-f0-9]{40}$/i,`${file}: ${action}`);
  }
});
