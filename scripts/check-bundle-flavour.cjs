// Inspect the release graph, including modules that Metro embeds as code (JSON,
// translations, typography and configuration) in addition to image files.
const fs = require('node:fs');
const [flavour, file] = process.argv.slice(2);
const owners = new Set();
function inspect(map) {
  for (const source of map.sources || []) {
    const match = source.replaceAll('\\', '/').match(/(?:^|\/)app\/instances\/([^/]+)\//);
    if (match) owners.add(match[1]);
  }
  for (const section of map.sections || []) inspect(section.map);
}
inspect(JSON.parse(fs.readFileSync(file, 'utf8')));
if (owners.size !== 1 || !owners.has(flavour)) {
  throw new Error('Expected ' + flavour + ' modules only, found: ' + [...owners].join(', '));
}
console.log('Release graph contains only the selected instance: ' + flavour);
