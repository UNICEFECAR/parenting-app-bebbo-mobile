const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const manifestPath = 'scripts/vector-assets-manifest.json';
function svgFiles(directory = path.join(root, 'app')) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? (name === path.join(root, 'app/assets/fonts') ? [] : svgFiles(name)) : name.endsWith('.svg') ? [name] : [];
  }).sort();
}
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function fingerprint() {
  return crypto.createHash('sha256').update(JSON.stringify(svgFiles().map(file => [
    path.relative(root, file).split(path.sep).join('/'), digest(file),
  ]))).digest('hex');
}
function verifyManifest(directory, manifest, currentFingerprint) {
  if (manifest.fingerprint !== currentFingerprint) throw new Error('SVG sources changed');
  for (const [file, hash] of Object.entries(manifest.files)) {
    const full = path.join(directory, file);
    if (!fs.existsSync(full) || digest(full) !== hash) throw new Error(`Missing or stale vector resource: ${file}`);
  }
}
function check() {
  if (!fs.existsSync(path.join(root, manifestPath))) throw new Error('Vector asset manifest is missing');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, manifestPath), 'utf8'));
  verifyManifest(root, manifest, fingerprint());
  console.log(`Verified ${Object.keys(manifest.files).length} native resources for all flavours`);
}

async function generate() {
  // Resolve actual application assets separately for every Babel flavour.
  // The upstream CLI clears shared resources when run for a single flavour.
  const temporary = path.join(root, '.vector-assets');
  fs.mkdirSync(temporary, {recursive: true});
  const sourceFingerprint = fingerprint();
  const getResourceName = require('react-native-vector-image/src/getResourceName');
  const readSvgAsset = require('react-native-vector-image/src/cli/readSvgAsset');
  const resolveAssetSources = require('react-native-vector-image/src/cli/resolveAssetSources');
  const generateAndroidAsset = require('react-native-vector-image/src/cli/generateAndroidAsset');
  const generateIosAsset = require('react-native-vector-image/src/cli/generateIosAsset');
  const unique = new Map();
  for (const flavour of ['bebbo', 'bebboDev', 'babuni', 'foleja', 'merhabaBebek', 'wawamor', 'reraiUmntwana', 'bebboPacific']) {
    console.log(`Collecting ${flavour} vector assets`);
    const output = path.join(temporary, flavour + '.json');
    const result = require('node:child_process').spawnSync(process.execPath,
      [path.join(__dirname, 'collect-vector-assets.cjs'), output], {
        cwd: root, env: {...process.env, FLAVOR: flavour}, stdio: 'inherit',
      });
    if (result.status !== 0) throw new Error(`Could not collect ${flavour} assets`);
    for (const asset of JSON.parse(fs.readFileSync(output, 'utf8'))) unique.set(getResourceName(asset), asset);
  }
  const android = path.join(temporary, 'android');
  const ios = path.join(temporary, 'ios');
  fs.rmSync(android, {recursive: true, force: true});
  fs.rmSync(ios, {recursive: true, force: true});
  // Complete conversion privately before changing the checked-in resources.
  for (const [name, asset] of unique) {
    const {light, dark} = resolveAssetSources(asset);
    const source = {light: readSvgAsset(light, '#000000'), dark: dark && readSvgAsset(dark, '#ffffff'), width: asset.width, height: asset.height};
    try {
      await generateAndroidAsset(source, name, android);
      await generateIosAsset(source, name, ios);
    } catch (error) {throw new Error(`${light}: ${error.message}`);}
  }
  const files = {};
  function publish(directory, destination) {
    for (const item of fs.readdirSync(directory, {withFileTypes: true})) {
      const source = path.join(directory, item.name);
      const target = path.join(destination, item.name);
      if (item.isDirectory()) publish(source, target);
      else {
        fs.mkdirSync(path.dirname(target), {recursive: true});
        fs.copyFileSync(source, target);
        files[path.relative(root, target).split(path.sep).join('/')] = digest(target);
      }
    }
  }
  if (sourceFingerprint !== fingerprint()) throw new Error('SVG sources changed during generation; run again');
  publish(android, path.join(root, 'android/app/src/main/res'));
  publish(ios, path.join(root, 'ios/ParentBuddyApp/Images.xcassets'));
  fs.writeFileSync(path.join(root, manifestPath), JSON.stringify({fingerprint: sourceFingerprint, files}, null, 2) + '\n');
  check();
}
if (require.main === module) {
  Promise.resolve().then(() => process.argv.includes('--generate') ? generate() : check()).catch(error => {
    console.error(`${error.message}. Run npm run assets:generate before building.`);
    process.exitCode = 1;
  });
}
module.exports = {check, fingerprint, verifyManifest};
