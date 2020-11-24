const { optimize, NormalModuleReplacementPlugin } = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  plugins: [
    new optimize.AggressiveMergingPlugin(),
    new optimize.OccurrenceOrderPlugin(),
    new NormalModuleReplacementPlugin(
      /environments\/environment\.ts/,
      './environment.prod.ts',
    ),
  ],
});
