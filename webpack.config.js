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
    //library:'we_recurring_select' // to enable we_recurring-select as object in window
  },
  mode: 'production',
  externals: {
    jquery: 'jQuery'
  },
  // resolve: {
  //   alias: {
  //     'jquery': require.resolve('jquery'),
  //   }
  // },

  //optimization: {
  //  minimize: false,
  //},

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        // use: {
        //   loader: 'babel-loader',
        //   options: {
        //     presets: ['@babel/preset-env']
        //   }
        // }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      // {
      //   test: require.resolve("jquery"),
      //   loader: "expose-loader",
      //   options: {
      //     exposes: ["$", "jQuery"],
      //   },
      // },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery",
    //   "window.$": "jquery",
    // }),

    // new webpack.ProvidePlugin({
    //   $: 'jquery/dist/jquery',
    //   jQuery: 'jquery/dist/jquery',
    //   'window.jQuery': 'jquery/dist/jquery',
    //   'window.$': 'jquery/dist/jquery',
    // })
  ]
};
