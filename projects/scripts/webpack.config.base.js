const { join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpackMerge = require('webpack-merge');

function extendManifest(buffer, specificRules = {}) {
  const baseManifest = JSON.parse(buffer.toString());

  const extendedManifest = webpackMerge(baseManifest, specificRules);

  return JSON.stringify(extendedManifest, null, 2);
}

module.exports = {
  entry: {
    'content-script': join(__dirname, 'src/content-script.ts'),
    'background-script': join(__dirname, 'src/background-script.ts')
  },
  output: {
    path: join(__dirname, '../../dist/scripts'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: join(__dirname, 'manifest.base.json'),
          to: join(__dirname, '../../dist/manifest.json'),
          transform(content) {
            const specificRules = require(`./${process.env.BROWSER}/manifest.json`);
            const version = require(`../../package.json`).version;
            return extendManifest(content, { ...specificRules, version });
          },
        },
        {
          from: join(__dirname, 'assets'),
          to: join(__dirname, '../../dist/assets'),
        }
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};
