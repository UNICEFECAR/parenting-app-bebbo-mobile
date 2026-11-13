const fs = require('node:fs');
const bundle = fs.readFileSync(process.argv[2], 'utf8');
for (const marker of ['visual-audit.json', 'visual-audit-status.json', 'visual-audit-error.json', '__auditScrolls', '__auditInputs', '__auditControls']) {
  if (bundle.includes(marker)) throw new Error(`Production bundle contains test controller marker: ${marker}`);
}
console.log('Production bundle excludes the visual test controller');
