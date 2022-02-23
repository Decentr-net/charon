const { join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { merge: webpackMerge } = require('webpack-merge');

const {
  CONTENT_API_SCRIPT_NAME,
  InlineWebpageAPIPlugin,
  INLINE_SCRIPT_NAME,
} = require('./plugins/inline-webpage-api.plugin');

function extendManifest(buffer, specificRules = {}) {
  const baseManifest = JSON.parse(buffer.toString());

  const extendedManifest = webpackMerge(baseManifest, specificRules);

  return JSON.stringify(extendedManifest, null, 2);
}

function getCopyManifestPlugin(specificRules = {}) {
  return new CopyPlugin({
    patterns: [
      {
        from: join(__dirname, 'manifest/manifest.json'),
        to: join(__dirname, '../../dist/manifest.json'),
        transform(content) {
          const version = require(`../../package.json`).version;
          return extendManifest(content, { ...specificRules, version });
        },
      },
    ]
  });
}

const config = {
  entry: {
    [INLINE_SCRIPT_NAME]: join(__dirname, 'src/content/webpage-api/webpage-script/script.ts'),
    'content-script': join(__dirname, 'src/content-script.ts'),
    [CONTENT_API_SCRIPT_NAME]: join(__dirname, 'src/content-api-script.ts'),
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
          from: join(__dirname, 'assets'),
          to: join(__dirname, '../../dist/assets'),
        }
      ],
    }),
    new InlineWebpageAPIPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};

module.exports = {
  config,
  manifestPluginFn: getCopyManifestPlugin,
};
