const fs = require('node:fs');
const path = require('node:path');
const getAssets = require('react-native-vector-image/src/cli/getAssets');
const getResourceName = require('react-native-vector-image/src/getResourceName');
getAssets({entryFile: 'index.js', resetCache: false}).then(all => {
  const assets = all.filter(asset => asset.type === 'svg');
  const flavour = process.env.FLAVOR || 'bebbo';
  for (const asset of assets) {
    for (const file of asset.files) {
      const instance = file.replaceAll('\\', '/').match(/\/instances\/([^/]+)\//);
      if (instance && instance[1] !== flavour) throw new Error(`Wrong flavour asset: ${file}`);
    }
    if (process.argv.includes('--check')) {
      const name = getResourceName(asset);
      for (const file of [
        `android/app/src/main/res/drawable/${name}.xml`,
        `ios/ParentBuddyApp/Images.xcassets/${name}.imageset/Contents.json`,
        `ios/ParentBuddyApp/Images.xcassets/${name}.imageset/light.pdf`,
      ]) if (!fs.existsSync(path.resolve(file))) throw new Error(`Missing vector resource: ${file}`);
    }
  }
  if (process.argv.includes('--check')) console.log(`Verified ${assets.length} referenced vector assets for ${flavour}`);
  else fs.writeFileSync(process.argv[2], JSON.stringify(assets));
}).catch(error => {console.error(error); process.exitCode = 1;});
