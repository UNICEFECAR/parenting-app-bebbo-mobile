const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const script = path.resolve(__dirname, '../ci-fixtures.cjs');

function runFixture(t, flavour, configuration = 'primary', ci = 'true') {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'bebbo-ci-fixtures-'));
  t.after(() => fs.rmSync(cwd, {recursive: true, force: true}));
  const envFile = path.join(cwd, 'github-env');
  const result = spawnSync(process.execPath, [script], {cwd, encoding: 'utf8',
    env: {...process.env, FLAVOR: flavour, NATIVE_CONFIGURATION: configuration, CI: ci, GITHUB_ENV: envFile}});
  return {cwd, result, variables: fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : ''};
}

for (const [flavour, variant, scheme, group, applicationId, iosId = applicationId] of [
  ['babuni', 'banglastaging', 'ParentBuddyAppBanglaDev', 'BanglaDevelopment', 'com.datamatics.bangla', 'com.datamatics.babuni'],
  ['foleja', 'xkstaging', 'ParentBuddyAppXkDev', 'XkDevelopment', 'com.datamatics.foleja'],
  ['bebbo', 'prod', 'ParentBuddyApp', 'Production', 'org.unicef.ecar.bebbo'],
  ['babuni', 'bangla', 'ParentBuddyAppBangla', 'Bangla', 'org.unicef.bangladesh.babuni'],
  ['foleja', 'xk', 'ParentBuddyAppXk', 'Xk', 'org.unicef.kosovo.foleja'],
]) {
  const configuration = scheme.endsWith('Dev') ? 'development' : 'primary';
  test(`${flavour}/${configuration} selects its own native app and fake Firebase configuration`, t => {
    const {cwd, result, variables} = runFixture(t, flavour, configuration);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(variables.includes(`ANDROID_APP_ID=${applicationId}\n`));
    assert.ok(variables.includes(`ANDROID_VARIANT=${variant[0].toUpperCase() + variant.slice(1)}\n`));
    assert.ok(variables.includes(`IOS_APP_ID=${iosId}\n`));
    assert.ok(variables.includes(`IOS_SCHEME=${scheme}\n`));
    assert.ok(variables.includes(`ENVFILE=${path.join(cwd, 'env/.env.' + flavour)}\n`));
    const google = JSON.parse(fs.readFileSync(path.join(cwd, `android/app/src/${variant}/google-services.json`)));
    assert.equal(google.client[0].client_info.android_client_info.package_name, applicationId);
    assert.equal(google.project_info.project_id, 'bebbo-compile-check');
    const plist = fs.readFileSync(path.join(cwd, `ios/GoogleServices/${group}/GoogleService-Info.plist`), 'utf8');
    assert.ok(plist.includes(`<key>BUNDLE_ID</key><string>${iosId}</string>`));
    assert.ok(plist.includes('<key>PROJECT_ID</key><string>bebbo-compile-check</string>'));
  });
}
for (const [flavour, configuration, ci] of [
  ['bebbo', 'development', 'true'], ['babuni', 'bogus', 'true'],
  ['unknown', 'primary', 'true'], ['__proto__', 'primary', 'true'], ['bebbo', 'primary', 'false'],
]) {
  test(`rejects unsupported fixture selection ${flavour}/${configuration}/CI=${ci}`, t => {
    const {cwd, result, variables} = runFixture(t, flavour, configuration, ci);
    assert.notEqual(result.status, 0);
    assert.equal(variables, '');
    assert.equal(fs.existsSync(path.join(cwd, 'env')), false);
  });
}
