const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path')

module.exports = {
  entry: './src/main',
  externals: {
    'scenegraph': 'commonjs2 scenegraph',
    'application': 'commonjs2 application',
    'assets': 'commonjs2 assets',
    'viewport': 'commonjs2 viewport',
    'uxp': 'commonjs2 uxp',
  },
  output: {
    globalObject: 'this',
    libraryTarget: 'commonjs2',
    filename: 'main.js',
    path: path.resolve('./build')
  },
  optimization: {
    minimize: false,
    namedModules: true
  },
  plugins: [
    new CopyWebpackPlugin({patterns: [
      {
        from: './public',
        to: './'
      }
    ]})               
  ],
}