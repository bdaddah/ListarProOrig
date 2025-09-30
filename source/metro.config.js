const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '@components': `${__dirname}/app/components`,
      '@assets': `${__dirname}/app/assets`,
      '@api': `${__dirname}/app/api`,
      '@redux': `${__dirname}/app/redux`,
      '@screens': `${__dirname}/app/screens`,
      '@models+types': `${__dirname}/app/models+types`,
      '@configs': `${__dirname}/app/configs`,
      '@utils': `${__dirname}/app/utils`,
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
