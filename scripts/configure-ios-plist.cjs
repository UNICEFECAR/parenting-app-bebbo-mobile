// Xcode expands its own build settings after this target-specific input is written.
const fs = require('node:fs');
const {parseEnv} = require('node:util');

const [template, environment, destination] = process.argv.slice(2);
const values = parseEnv(fs.readFileSync(environment, 'utf8'));
const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;'};
const plist = fs.readFileSync(template, 'utf8').replace(
  /\$\((facebookAppId|facebookClientToken|facebookAppDisplayName|projectNumber|clientIdKey)\)/g,
  (_, key) => (values[key] || '').replace(/[&<>]/g, char => entities[char])
);
fs.writeFileSync(destination, plist);
