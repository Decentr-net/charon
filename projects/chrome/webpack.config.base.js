const { join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
          from: join(__dirname, 'manifest.json'),
          to: join(__dirname, '../../dist'),
        },
        {
          from: join(__dirname, '../../assets'),
          to: join(__dirname, '../../dist/assets'),
        }
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};
