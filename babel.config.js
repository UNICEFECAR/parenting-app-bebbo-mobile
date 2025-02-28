module.exports = (api) => {
  const babelEnv = api.env();
  const flavor = process.env.FLAVOR || 'bebbo';
  const plugins = [
    [
      'module:react-native-dotenv',
      {
        moduleName: "react-native-dotenv",
        path: `env/.env.${flavor}`,
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@components': './app/components',
          '@assets': './app/assets',
          '@screens': './app/screens',
          '@types': './app/types',
          '@styles': `./app/instance/${flavor}/styles`,
          '@images': `./app/instance/${flavor}/assets/images`,
          '@navigation': './app/navigation',
          '@offlinedata': './app/assets/translations/appOfflineData',
        },
      },
    ],
    [
      "react-native-reanimated/plugin",
    ],
  ];
  //change to 'production' to check if this is working in 'development' mode
  if (babelEnv !== 'development') {
    plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
  }
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: plugins,
  };
};

