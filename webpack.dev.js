const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
    ],
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      $components: path.resolve(__dirname, "src/components"),
      $containers: path.resolve(__dirname, "src/containers"),
      $constants: path.resolve(__dirname, "src/constants"),
      $rests: path.resolve(__dirname, "src/rests"),
      $utils: path.resolve(__dirname, "src/utils"),
      $operations: path.resolve(__dirname, "src/operations"),
      $models: path.resolve(__dirname, "src/models"),
    },
  },
  devServer: {
    hot: true,
  },
  output: {
    filename: "dist/bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
