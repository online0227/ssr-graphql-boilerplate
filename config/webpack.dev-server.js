const path = require("path")
const webpack = require("webpack")
const externals = require("./node-externals");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")

module.exports = {
  name: "server",
  mode: "development",
  target: "node",
  externals,
  entry: "./server/render.js",
  output: {
    filename: "dev-server-bundle.js",
    chunkFilename: "[name].js",
    path: path.resolve(__dirname, "../build"),
    libraryTarget: "commonjs2",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ExtractCssChunks.loader, "css-loader"]
      }, {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "/images/[name].[ext]",
              emitFile: false
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "markdown-with-front-matter-loader"
          }
        ]
      }
    ]
  },
  plugins: [new ExtractCssChunks(),
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  }),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("development")
    }
  })
  ]
}
