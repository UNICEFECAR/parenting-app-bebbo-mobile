const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const babel = require('@babel/core');

test('the patched resolver resolves globbed roots with the maintained glob API', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'bebbo-resolver-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  fs.mkdirSync(path.join(directory, 'packages/alpha'), {recursive: true});
  fs.writeFileSync(path.join(directory, 'packages/alpha/shared.js'), 'export default 1;');
  const result = babel.transformSync("import shared from 'shared';", {
    configFile: false, babelrc: false, cwd: directory, filename: path.join(directory, 'entry.js'),
    plugins: [[require.resolve('babel-plugin-module-resolver'), {root: [path.join(directory, 'packages/*')]}]],
  });
  assert.match(result.code, /\.\/packages\/alpha\/shared/);
});

test('application type/value imports avoid TypeScript reserved declaration-package namespace', () => {
  const result = babel.transformSync("import {CHILDREN_PATH} from '@app-types/types'; console.log(CHILDREN_PATH);", {
    filename: path.resolve('app/alias-check.ts'), envName: 'test',
  });
  assert.match(result.code, /(?:\.\.\/)?app\/types\/types|\.\/types\/types/);
  const config = fs.readFileSync('tsconfig.json', 'utf8');
  assert.match(config, /"@app-types\/\*"/);
  assert.doesNotMatch(config, /"@types\/\*"/);
});
