const path = require('path');

module.exports = {
  entry: './src/we-recurring-select.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'we-recurring-select.min.js',
    library:'we-recurring-select' // to enable we-recurring-select as object in window
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
      }
    ]
  }
};
