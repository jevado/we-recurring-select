const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
      './src/js/we-recurring-select.js',
      './src/scss/recurring_select.scss'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/we-recurring-select.min.js',
    library:'we_recurring_select' // to enable we-recurring-select as object in window
  },
  mode: 'production',
  externals: {
    jquery: 'jQuery'
    // add external dependencies here
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jQuery",
      "window.jQuery": "jquery"
    })
  ]
};