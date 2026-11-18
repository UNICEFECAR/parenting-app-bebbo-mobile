const path = require('node:path');
const {loadConfig} = require('metro-config');
const MetroServer = require('metro/private/Server');
const Server = MetroServer.default || MetroServer.Server || MetroServer;

// Resolve the actual platform graph, including .android and .ios import variants.
async function collectAssets(flavour, platform) {
  const config = await loadConfig({cwd: path.join(__dirname, '..')});
  const server = new Server(config, {watch: false});
  try {
    const assets = await server.getAssets({...Server.DEFAULT_BUNDLE_OPTIONS,
      entryFile: 'index.js', platform, dev: false, minify: false, bundleType: 'bundle'});
    for (const asset of assets) {
      for (const file of asset.files) {
        const instance = file.replaceAll('\\', '/').match(/\/app\/instances\/([^/]+)\//);
        if (instance && instance[1] !== flavour) throw new Error('Foreign asset: ' + file);
      }
    }
    return assets.filter(asset => asset.type === 'svg');
  } finally { await server.end(); }
}
module.exports = {collectAssets};
