// Static coverage evidence. Does not imply an event was delivered or a screen executed.
const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
function walk(directory) {return fs.readdirSync(directory, {withFileTypes: true}).flatMap(item => {
  const file = path.join(directory, item.name);
  return item.isDirectory() ? (item.name === '__tests__' ? [] : walk(file)) : /\.[jt]sx?$/.test(file) ? [file] : [];
});}
const calls = [], routes = [];
for (const file of walk('app').concat(['App.tsx'])) {
  const source = fs.readFileSync(file, 'utf8');
  if (!/logEvent|logAnalyticsEvent|\.Screen/.test(source)) continue;
  const ast = parser.parse(source, {sourceType: 'module', plugins: ['typescript', 'jsx']});
  const text = node => node ? source.slice(node.start, node.end).replace(/\s+/g, ' ').slice(0, 500) : null;
  traverse(ast, {
    CallExpression(p) {
      if (!['logEvent', 'logAnalyticsEvent'].includes(p.node.callee.name)) return;
      let event = p.node.arguments[0];
      if (event?.type === 'Identifier') {
        const binding = p.scope.getBinding(event.name);
        if (binding?.path.node.type === 'VariableDeclarator') event = binding.path.node.init;
      }
      calls.push({file, line: p.node.loc.start.line, api: p.node.callee.name, event: text(event),
        parameters: text(p.node.arguments[1])});
    },
    JSXOpeningElement(p) {
      if (p.node.name.type !== 'JSXMemberExpression' || p.node.name.property.name !== 'Screen') return;
      const name = p.node.attributes.find(a => a.name?.name === 'name');
      const component = p.node.attributes.find(a => a.name?.name === 'component');
      routes.push({file, line: p.node.loc.start.line, route: text(name?.value), component: text(component?.value),
        screen_view: 'shared navigation tracker; runtime validation pending'});
    },
  });
}
const output = {kind: 'static source inventory', generated_by: 'node scripts/analytics-inventory.cjs',
  limitation: 'Navigation routes are observable via trackScreen, not proof of runtime traversal. Expressions can be dynamic. Calls are requests, not delivery acknowledgements.',
  routes, calls, screenFiles: walk('app/screens').filter(f => f.endsWith('.tsx'))};
const json = JSON.stringify(output, null, 2) + '\n';
const target = 'docs/upgrades/react-native-0.87/analytics-source-inventory.json';
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== json) throw new Error('Analytics inventory is stale; regenerate it');
} else fs.writeFileSync(target, json);
console.log(`${routes.length} route declarations, ${calls.length} event calls, ${output.screenFiles.length} screen files inventoried`);
