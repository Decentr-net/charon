const { join } = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    'content-script': join(__dirname, 'src/content-script.ts'),
    'background-script': join(__dirname, 'src/background-script.ts')
  },
  output: {
    path: join(__dirname, '../charon/dist'),
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
  resolve: {
    extensions: ['.ts', '.js']
  }
};
