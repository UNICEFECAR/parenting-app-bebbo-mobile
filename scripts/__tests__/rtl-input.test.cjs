const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
for (const flavour of fs.readdirSync('app/instances').filter(name => fs.existsSync(`app/instances/${name}/config/appConfig.ts`))) {
  test(`${flavour}: name fields preserve Arabic/Urdu vowel marks and Bengali combining marks`, () => {
    const ast = parser.parse(fs.readFileSync(path.join('app/instances', flavour, 'config/appConfig.ts'), 'utf8'), {sourceType: 'module', plugins: ['typescript']});
    let regex;
    traverse(ast, {ObjectProperty(p) {if (p.node.key.name === 'regexpEmojiPresentation') regex = new RegExp(p.node.value.pattern, p.node.value.flags);}});
    assert.ok(regex);
    for (const name of ['فاطِمة', 'عائشَہ', 'শিশু', 'José']) assert.equal(name.replace(regex, ''), name);
    assert.equal('Sam😀123'.replace(regex, ''), 'Sam');
  });
}
