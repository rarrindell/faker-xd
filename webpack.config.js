const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// module.exports = {
//   entry: './src/main',
//   externals: {
//     'scenegraph': 'commonjs2 scenegraph',
//     'application': 'commonjs2 application',
//     'assets': 'commonjs2 assets',
//     'viewport': 'commonjs2 viewport',
//     'uxp': 'commonjs2 uxp',
//   },
//   output: {
//     globalObject: 'this',
//     libraryTarget: 'commonjs2',
//     filename: 'main.js',
//     path: path.resolve('./build')
//   },
//   optimization: {
//     minimize: false,
//     namedModules: true
//   },
//   plugins: [
//     new CopyWebpackPlugin({patterns: [
//       {
//         from: './public',
//         to: './'
//       }
//     ]})
//   ],
// }
module.exports = {
  entry: "./src/main.ts",
  output: {
    path: path.resolve("./build"),
    filename: "main.js",
    libraryTarget: "commonjs2",
  },
  // devtool: "none",
  resolve: {
    extensions: [".ts", ".html", "..."],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    scenegraph: "scenegraph",
    application: "application",
    assets: "assets",
    viewport: "viewport",
    uxp: "uxp",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./public",
          to: "./",
        },
      ],
    }),
  ],
};
