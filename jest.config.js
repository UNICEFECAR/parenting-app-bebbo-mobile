module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: [
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/app/**/__tests__/**/*.test.[jt]s?(x)',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/app/instances/.*/styles/package.json',
    '<rootDir>/app/instances/.*/assets/images/package.json',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|nanoid)/)',
  ],
};
