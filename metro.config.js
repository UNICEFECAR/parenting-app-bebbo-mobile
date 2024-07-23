const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
 const defaultConfig = getDefaultConfig(__dirname);
 const { assetExts, sourceExts } = defaultConfig.resolver;

const blacklist = require('metro-config/src/defaults/exclusionList')
const config = {
    resetCache:true,
    transformer: {
      babelTransformerPath: require.resolve(
        "react-native-svg-transformer/react-native"
      ),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
      blacklistRE: blacklist([/xk\/.*/,/bebbo\/.*/]),
    }
  };
  

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
