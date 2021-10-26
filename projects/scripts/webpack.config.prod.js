const { NormalModuleReplacementPlugin } = require('webpack');
const { merge: webpackMerge } = require('webpack-merge');
const { config: baseConfig, manifestPluginFn } = require('./webpack.config.base');

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  plugins: [
    manifestPluginFn({
      "content_security_policy": "script-src 'self' https://ssl.google-analytics.com; object-src 'self'",
    }),
    new NormalModuleReplacementPlugin(
      /environments\/environment\.ts/,
      './environment.prod.ts',
    ),
  ],
});
