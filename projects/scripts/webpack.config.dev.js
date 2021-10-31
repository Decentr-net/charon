const { merge: webpackMerge } = require('webpack-merge');
const { config: baseConfig, manifestPluginFn } = require('./webpack.config.base');

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    manifestPluginFn({
      "content_security_policy": "script-src 'self' 'unsafe-eval' https://ssl.google-analytics.com; object-src 'self'",
    }),
  ],
});
