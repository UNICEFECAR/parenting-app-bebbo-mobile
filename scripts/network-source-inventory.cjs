// Public source inventory, not a production allowlist or a live TLS test.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const walk = dir => fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : /\.(ts|tsx|js|json)$/.test(file) ? [file] : [];
});
const flavours = [];
for (const entry of fs.readdirSync(path.join(root, 'app/instances'), {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name))) {
  if (!entry.isDirectory()) continue;
  const hosts = new Map();
  for (const file of walk(path.join(root, 'app/instances', entry.name))) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\b(https?):\/\/([a-z0-9][a-z0-9.-]*)(?::[0-9]+)?(?=[/?#\s"'\\]|$)/gi)) {
      const key = `${match[1].toLowerCase()}://${match[2].toLowerCase()}`;
      const value = hosts.get(key) || {origin: key, references: 0, sourceFiles: new Set()};
      value.references++;
      value.sourceFiles.add(path.relative(root, file));
      hosts.set(key, value);
    }
  }
  flavours.push({flavour: entry.name,
    productionApi: 'External configuration required; CI fixtures are not production evidence',
    hosts: [...hosts.values()].sort((a, b) => a.origin.localeCompare(b.origin)).map(x => ({...x, sourceFiles: [...x.sourceFiles].sort()}))});
}
const iosFiles = fs.readdirSync(path.join(root, 'ios')).filter(n => n.endsWith('Info.plist')).map(n => `ios/${n}`).concat(['ios/ParentBuddyApp/Info.plist']);
const ios = iosFiles.filter(n => fs.existsSync(path.join(root, n))).sort().map(file => ({file,
  allowsArbitraryLoads: /<key>NSAllowsArbitraryLoads<\/key>\s*<true\s*\/>/.test(fs.readFileSync(path.join(root, file), 'utf8'))}));
const output = JSON.stringify({scope: 'Hardcoded public instance source references and native source configuration',
  limitations: 'References may be links or examples, not actual requests. Runtime API origins, redirects, SDK endpoints and device TLS results require separate verification. No credentials, query values or environment files are read. Do not use this inventory automatically as a trust allowlist.',
  generatedBy: 'node scripts/network-source-inventory.cjs', flavours, ios}, null, 2) + '\n';
const target = path.join(root, 'docs/upgrades/react-native-0.87/network-source-inventory.json');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) throw new Error('Network source inventory is stale');
} else fs.writeFileSync(target, output);
console.log(`${flavours.length} flavours and ${ios.length} iOS plist policies inventoried; production validation remains separate`);
