const { DefinePlugin } = require('webpack');
const { merge: webpackMerge } = require('webpack-merge');
const { config: baseConfig, manifestPluginFn } = require('./webpack.config.base');

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  plugins: [
    manifestPluginFn({
      "content_security_policy": "script-src 'self' 'unsafe-eval' 'wasm-eval' https://ssl.google-analytics.com https://beacon-v2.helpscout.net; object-src 'self'",
    }),
    new DefinePlugin({
      IS_QA_MODE: true,
    }),
  ],
});
