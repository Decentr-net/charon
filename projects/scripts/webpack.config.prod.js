const { optimize, NormalModuleReplacementPlugin } = require('webpack');
const webpackMerge = require('webpack-merge');
const { config: baseConfig, manifestPluginFn } = require('./webpack.config.base');

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  plugins: [
    manifestPluginFn({
      "content_security_policy": "script-src 'self' https://www.googletagmanager.com; object-src 'self'",
    }),
    new optimize.AggressiveMergingPlugin(),
    new optimize.OccurrenceOrderPlugin(),
    new NormalModuleReplacementPlugin(
      /environments\/environment\.ts/,
      './environment.prod.ts',
    ),
  ],
});
