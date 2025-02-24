const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const path = require("path");

process.env.FLAVOR = process.env.FLAVOR || "bebbo"; // Default to 'bebbo'
const exclusionList = require("metro-config/src/defaults/exclusionList");

const blacklist = require("metro-config/src/defaults/exclusionList");
const config = {
  resetCache: true,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    blacklistRE: exclusionList([
      /app\/instance\/.*\/styles\/package\.json/, // Exclude conflicting package.json files
      /app\/instance\/.*\/assets\/images\/package\.json/,
    ]),
    extraNodeModules: {
      "react-native-dotenv": path.resolve(
        __dirname,
        `.env.${process.env.FLAVOR}`
      ),
    },
  },
  resetCache: true,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
