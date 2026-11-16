const test = require('node:test');
const assert = require('node:assert/strict');
const fixtures = require('./fixtures/chart-paths-d3-3.2.0.json');

// The component suite mocks D3. Exercise the actual installed chart engine
// against paths recorded before its upgrade, including RTL and edge cases.
for (const fixture of fixtures) {
  test(`D3 preserves ${fixture.name} (${fixture.rtl ? 'RTL' : 'LTR'})`, async () => {
    const {area, curveNatural} = await import('d3-shape');
    const path = area()
      .x(point => fixture.rtl ? 240 - point[0] : point[0])
      .y0(180)
      .y1(point => point[1])
      .curve(curveNatural)(fixture.points);
    assert.equal(path, fixture.expected);
  });
}
