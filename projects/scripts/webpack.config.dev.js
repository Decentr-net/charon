const webpackMerge = require('webpack-merge');
const { config: baseConfig, manifestPluginFn } = require('./webpack.config.base');

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  plugins: [
    manifestPluginFn({
      "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",
    }),
  ],
});
