const plugins = ['react-native-reanimated/plugin'];

if (process.env.BABEL_ENV === 'production') {
  plugins.push('transform-remove-console');
}

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
