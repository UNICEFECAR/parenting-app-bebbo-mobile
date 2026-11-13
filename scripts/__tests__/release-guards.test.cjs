const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const {verifyManifest} = require('../vector-assets.cjs');
const {flavourCacheVersion} = require('../flavour-cache.cjs');
const {diagnostics, additions} = require('../check-types.cjs');

test('Metro cannot share cached transforms across flavours or changed environment files', () => {
  const original = flavourCacheVersion('bebbo', 'key=value');
  assert.equal(original, flavourCacheVersion('bebbo', 'key=value'));
  assert.notEqual(original, flavourCacheVersion('reraiUmntwana', 'key=value'));
  assert.notEqual(original, flavourCacheVersion('bebbo', 'key=changed'));
});

test('native resource verification rejects missing, altered and out-of-date assets', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'bebbo-resource-test-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  const file = path.join(directory, 'rerai.xml');
  fs.writeFileSync(file, 'green-logo');
  const hash = crypto.createHash('sha256').update('green-logo').digest('hex');
  const manifest = {fingerprint: 'source', files: {'rerai.xml': hash}};
  assert.doesNotThrow(() => verifyManifest(directory, manifest, 'source'));
  assert.throws(() => verifyManifest(directory, manifest, 'changed'), /SVG sources changed/);
  fs.writeFileSync(file, 'different-logo');
  assert.throws(() => verifyManifest(directory, manifest, 'source'), /Missing or stale/);
  fs.unlinkSync(file);
  assert.throws(() => verifyManifest(directory, manifest, 'source'), /Missing or stale/);
});

test('type regression checks tolerate moved existing diagnostics but reject new ones', () => {
  const before = diagnostics('app/a.ts(1,2): error TS2322: Wrong type.\n');
  const moved = diagnostics('app/a.ts(100,20): error TS2322: Wrong type.\n');
  assert.deepEqual(additions(moved, before), []);
  const extra = diagnostics('app/a.ts(100,20): error TS2322: Wrong type.\napp/a.ts(101,20): error TS2322: Wrong type.\n');
  assert.equal(additions(extra, before).length, 1);
  assert.equal(additions(diagnostics('app/b.ts(1,2): error TS2304: Missing name.'), before).length, 1);
});
