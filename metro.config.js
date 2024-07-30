const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const blacklist = require('metro-config/src/defaults/exclusionList')
const config = {
    resetCache:true,
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
    blacklistRE: blacklist([/xk\/.*/,/bebbo\/.*/]),
    }
  };
  

module.exports = mergeConfig(getDefaultConfig(__dirname), config);