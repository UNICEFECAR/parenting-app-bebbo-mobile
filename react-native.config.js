module.exports = {
    project: {
      ios: {},
      android: {},
    },
    assets: ['./app/assets/fonts'],
    dependencies: {
      // iOS uses the target's generated plist and Metro's instance-specific configuration.
      // The unused native config pod writes every build's environment into node_modules.
      'react-native-config': { platforms: { ios: null } },
      '@react-native-google-signin/google-signin': { platforms: { android: null } },
      ...(process.env.NO_FLIPPER ? { 'react-native-flipper': { platforms: { ios: null } } } : {})}
  };
