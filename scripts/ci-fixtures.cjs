// Deliberately fake configuration, only for unsigned CI compile checks.
// These files are ignored by Git and must never be used for a distributable.
const fs = require('node:fs');
const path = require('node:path');
if (process.env.CI !== 'true') throw new Error('Build fixtures are restricted to CI');
const flavours = {
  bebbo: ['prod', 'ParentBuddyApp', 'Production', 'org.unicef.ecar.bebbo'],
  bebboDev: ['prodstaging', 'ParentBuddyAppDev', 'Development', 'org.unicef.bebbodev'],
  babuni: ['bangla', 'ParentBuddyAppBangla', 'Bangla', 'org.unicef.bangladesh.babuni'],
  foleja: ['xk', 'ParentBuddyAppXk', 'Xk', 'org.unicef.kosovo.foleja'],
  merhabaBebek: ['merhababebek', 'MerhabaBebek', 'MerhabaBebek', 'org.unicef.ecar.merhababebek'],
  wawamor: ['wawamor', 'Wawamor', 'Wawamor', 'org.unicef.ec.wawamor'],
  reraiUmntwana: ['reraiumntwana', 'ReraiUmntwana', 'ReraiUmntwana', 'org.unicef.zw.reraiumntwana'],
  bebboPacific: ['bebbopacific', 'BebboPacific', 'BebboPacific', 'org.unicef.pc.bebbopacific'],
};
const flavour = process.env.FLAVOR || 'bebbo';
if (!Object.hasOwn(flavours, flavour)) throw new Error('Unknown flavour');
const developmentTargets = {
  babuni: ['banglastaging', 'ParentBuddyAppBanglaDev', 'BanglaDevelopment', 'com.datamatics.bangla', 'com.datamatics.babuni'],
  foleja: ['xkstaging', 'ParentBuddyAppXkDev', 'XkDevelopment', 'com.datamatics.foleja'],
};
const configuration = process.env.NATIVE_CONFIGURATION || 'primary';
if (!['primary', 'development'].includes(configuration)) throw new Error('Unknown native configuration');
if (configuration === 'development' && !Object.hasOwn(developmentTargets, flavour)) {
  throw new Error('No auxiliary development target for this flavour');
}
const selected = configuration === 'development' ? developmentTargets[flavour] : flavours[flavour];
function write(file, data) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, data);
}
for (const [flavour, [variant, , group, bundleId, iosBundleId = bundleId]] of [
  ...Object.entries(flavours), ...Object.entries(developmentTargets),
]) {
  write(`env/.env.${flavour}`, [
    'apiUrlDevelop=https://example.invalid', 'facebookAppDisplayName=CI',
    'facebookAppId=000000000000000', 'facebookClientToken=ci-placeholder',
    'projectNumber=123456789012', 'clientIdKey=ci-placeholder.apps.googleusercontent.com',
    'encryptionsKey=' + '0'.repeat(64), 'encryptionsIVKey=' + '0'.repeat(32),
  ].join('\n') + '\n');
  write(`android/app/src/${variant}/google-services.json`, JSON.stringify({
    project_info: {project_number: '123456789012', project_id: 'bebbo-compile-check', storage_bucket: 'bebbo-compile-check.invalid'},
    client: [{client_info: {mobilesdk_app_id: '1:123456789012:android:0000000000000000000000', android_client_info: {package_name: bundleId}},
      oauth_client: [], api_key: [{current_key: 'AIza' + '0'.repeat(35)}], services: {appinvite_service: {other_platform_oauth_client: []}}}],
    configuration_version: '1',
  }));
  const values = {GOOGLE_APP_ID: '1:123456789012:ios:0000000000000000000000', GCM_SENDER_ID: '123456789012',
    API_KEY: 'AIza' + '0'.repeat(35), BUNDLE_ID: iosBundleId, PROJECT_ID: 'bebbo-compile-check',
    CLIENT_ID: 'ci-placeholder.apps.googleusercontent.com', REVERSED_CLIENT_ID: 'com.googleusercontent.apps.ci-placeholder', PLIST_VERSION: '1'};
  write(`ios/GoogleServices/${group}/GoogleService-Info.plist`, '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict>' +
    Object.entries(values).map(([key, value]) => `<key>${key}</key><string>${value}</string>`).join('') + '</dict></plist>\n');
}
if (process.env.GITHUB_ENV) fs.appendFileSync(process.env.GITHUB_ENV, [
  `ANDROID_VARIANT=${selected[0][0].toUpperCase() + selected[0].slice(1)}`,
  `ANDROID_APP_ID=${selected[3]}`,
  `IOS_APP_ID=${selected[4] || selected[3]}`, `IOS_SCHEME=${selected[1]}`, `ENVFILE=${path.resolve('env/.env.' + (process.env.FLAVOR || 'bebbo'))}`,
].join('\n') + '\n');
