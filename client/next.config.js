module.exports = {
  // webpack5: true,
  webpack(config) {
    // if (!config) {
    //   console.error('Webpack config is undefined');
    //   return;
    // }

    config.watchOptions.poll = 300;

    // config.resolve.fallback = {
    //   ...config.resolve.fallback,

    //   path: false, // the solution
    //   fs: false, // the solution
    //   net: false, // the solution
    // };

    return config;
  },
};
