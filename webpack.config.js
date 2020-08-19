const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// BEGIN: generate HTML pages and links using javascript hacks
const pages = require("./src/pages.js");

var links = "";

for (page in pages) {
  links += `<a class="linka" href="${page}.html"><li class="linkli">${pages[page].titletext}</li></a>`;
}

for (page in pages) {
  pages[page].links = links;

  var split = pages[page].bodytext.split("\n");
  var bodytext = "";
  for (var string of split) {
    if (string !== "") {
      bodytext += `<p>${string}</p>`;
    }
  }
  pages[page].bodytext = bodytext;
}

var myplugins = [new CleanWebpackPlugin()];

for (page in pages) {
  myplugins.push(
    new HtmlWebpackPlugin({
      template: "src/template.html",
      filename: page + ".html",
      templateParameters: pages[page],
    })
  );
}

myplugins.push(new MiniCssExtractPlugin());
// END: javascript hacks. to anyone reading this, im sorry.

module.exports = {
  entry: "./src/index.js",
  plugins: myplugins,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  devServer: {
    contentBase: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        loader: "file-loader",
        options: {
          outputPath: "assets",
          name: "[name].[ext]",
        },
      },
    ],
  },
};
