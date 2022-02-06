const { DefinePlugin } = require('webpack');
const { merge: webpackMerge } = require('webpack-merge');
const { config: baseConfig, manifestPluginFn } = require('./webpack.config.base');

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  plugins: [
    manifestPluginFn({
      "content_security_policy": "script-src 'self' 'wasm-eval' 'unsafe-eval' 'sha256-CA+WQBPlufcdIkUhUDOoZD+LI9nFG5pEQ8mVu8YjH3Q=' https://ssl.google-analytics.com https://beacon-v2.helpscout.net; object-src 'self'",
    }),
    new DefinePlugin({
      IS_QA_MODE: true,
    }),
  ],
});
