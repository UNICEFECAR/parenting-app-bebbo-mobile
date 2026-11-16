const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path = require("path");
const fs = require("fs");
const {flavourCacheVersion} = require("./scripts/flavour-cache.cjs");

process.env.FLAVOR = process.env.FLAVOR || "bebbo"; // Default to 'bebbo'

// Metro's disk cache must not reuse a Bebbo transform for another flavour.
const flavourEnvPath = path.join(__dirname, `env/.env.${process.env.FLAVOR}`);
const config = {
  maxWorkers: 2,
  cacheVersion: flavourCacheVersion(process.env.FLAVOR,
    fs.existsSync(flavourEnvPath) ? fs.readFileSync(flavourEnvPath) : ''),
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    blockList: [
      /app\/instances\/.*\/styles\/package\.json/, // Exclude conflicting package.json files
      /app\/instances\/.*\/assets\/images\/package\.json/,
    ],
    extraNodeModules: {
      "react-native-dotenv": path.resolve(
        __dirname,
        `env/.env.${process.env.FLAVOR}`
      ),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
