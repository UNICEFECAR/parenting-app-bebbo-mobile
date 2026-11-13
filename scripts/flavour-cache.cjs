const crypto = require('node:crypto');
function flavourCacheVersion(flavour, environmentContents) {
  const hash = crypto.createHash('sha256').update(environmentContents).digest('hex');
  return `bebbo-${flavour}-${hash}`;
}
module.exports = {flavourCacheVersion};
