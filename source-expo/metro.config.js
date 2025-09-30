const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const ALIASES = {
  '@components': `${__dirname}/app/components`,
  '@assets': `${__dirname}/app/assets`,
  '@api': `${__dirname}/app/api`,
  '@redux': `${__dirname}/app/redux`,
  '@screens': `${__dirname}/app/screens`,
  '@models+types': `${__dirname}/app/models+types`,
  '@configs': `${__dirname}/app/configs`,
  '@utils': `${__dirname}/app/utils`,
};

// Fix for Expo SDK 53 compatibility issues
config.resolver.unstable_enablePackageExports = false;
config.resolver.unstable_enableSymlinks = false;

// Fix for ReactSharedInternals error
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add extra node modules for hoisting issues
config.resolver.nodeModulesPaths = [
  `${__dirname}/node_modules`,
  `${__dirname}/shared/node_modules`,
];

// Reset cache version to force refresh
config.cacheVersion = '1.0';

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Ensure you call the default resolver.
  return context.resolveRequest(
      context,
      // Use an alias if one exists.
      ALIASES[moduleName] ?? moduleName,
      platform
  );
};

module.exports = config;
