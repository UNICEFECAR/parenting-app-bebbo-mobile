const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function files(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  }).sort();
}
function verifyManifest(directory, manifest, fingerprint) {
  if (manifest.fingerprint !== fingerprint) throw new Error('SVG sources changed');
  for (const [name, hash] of Object.entries(manifest.files)) {
    const file = path.join(directory, name);
    if (!fs.existsSync(file) || digest(file) !== hash) throw new Error('Missing or stale vector resource: ' + name);
  }
}
async function main() {
  const flavour = process.env.FLAVOR || 'bebbo';
  if (!fs.readdirSync(path.join(root, 'app/instances'), {withFileTypes:true}).some(e => e.isDirectory() && e.name === flavour)) throw Error('Unknown FLAVOR');
  process.env.FLAVOR = flavour;
  process.env.NODE_ENV = 'production';
  const {collectAssets} = require('./collect-vector-assets.cjs');
  const resourceName = require('react-native-vector-image/src/getResourceName');
  const readSvg = require('react-native-vector-image/src/cli/readSvgAsset');
  const sources = require('react-native-vector-image/src/cli/resolveAssetSources');
  const native = path.join(root, 'app/instances', flavour, 'native');
  const platforms = process.env.BUNDLE_PLATFORM ? [process.env.BUNDLE_PLATFORM] : ['android', 'ios'];
  for (const platform of platforms) {
    if (!['android','ios'].includes(platform)) throw Error('Unknown vector platform');
    const destination = path.join(native, platform === 'android' ? 'res' : 'Vectors.xcassets');
    const assets = await collectAssets(flavour, platform);
    const selected = new Map(assets.map(asset => [resourceName(asset), asset]));
    if (!selected.size) throw Error('Empty vector resource graph');
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify(
      Array.from(selected.entries(), ([name, asset]) => [name, asset.hash]).sort()
    )).digest('hex');
    const manifestFile = path.join(native, platform + '.json');
    if (process.argv.includes('--generate')) {
      fs.mkdirSync(native, {recursive:true});
      const tmp = fs.mkdtempSync(path.join(native, '.generate-'));
      try {
        if (platform === 'ios') fs.writeFileSync(path.join(tmp,'Contents.json'), '{"info":{"author":"xcode","version":1}}\n');
        const convert = require('react-native-vector-image/src/cli/' + (platform === 'android' ? 'generateAndroidAsset' : 'generateIosAsset'));
        for (const [name, asset] of selected) {
          const {light, dark} = sources(asset);
          await convert({light: readSvg(light,'#000000'), dark: dark && readSvg(dark,'#ffffff'), width:asset.width,height:asset.height},name,tmp);
        }
        // Only the selected flavour's generated outputs are replaced.
        const hashes = Object.fromEntries(files(tmp).map(f => [path.relative(tmp,f), digest(f)]));
        fs.mkdirSync(destination,{recursive:true});
        for (const f of files(tmp)) {
          const target = path.join(destination,path.relative(tmp,f));
          fs.mkdirSync(path.dirname(target),{recursive:true});
          if (!fs.existsSync(target) || digest(target) !== digest(f)) fs.copyFileSync(f,target);
        }
        for (const f of files(destination)) if (!Object.hasOwn(hashes,path.relative(destination,f))) fs.unlinkSync(f);
        for (const entry of fs.readdirSync(destination,{withFileTypes:true})) {
          const sub = path.join(destination,entry.name);
          if (entry.isDirectory() && !fs.readdirSync(sub).length) fs.rmdirSync(sub);
        }
        fs.writeFileSync(manifestFile,JSON.stringify({fingerprint,files:hashes},null,2)+'\n');
      } finally {fs.rmSync(tmp,{recursive:true,force:true});}
    }
    const manifest = JSON.parse(fs.readFileSync(manifestFile,'utf8'));
    verifyManifest(destination,manifest,fingerprint);
    if (files(destination).length !== Object.keys(manifest.files).length) throw Error('Unexpected generated resource in ' + destination);
    console.log(flavour + ' ' + platform + ': ' + selected.size + ' referenced vectors verified');
  }
}
if (require.main === module) main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports = {verifyManifest};
