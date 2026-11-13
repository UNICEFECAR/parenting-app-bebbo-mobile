module.exports = {
    project: {
      ios: {},
      android: {},
    },
    assets: ['./app/assets/fonts'],
    dependencies: {
      '@react-native-google-signin/google-signin': { platforms: { android: null } },
      ...(process.env.NO_FLIPPER ? { 'react-native-flipper': { platforms: { ios: null } } } : {})}
  };
