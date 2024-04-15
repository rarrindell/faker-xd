const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve("./build"),
    filename: "main.js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".html", "..."],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: ["raw-loader"],
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
