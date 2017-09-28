'use strict'
const webpack = require('webpack')

module.exports = {
  entry: {
    index: ['./app/src/js/index']
  },
  output: {
    path: '/app/build/js',
    filename: '[name].js',
    publicPath: '/js',
    chunkFilename: '[name].js',
  },
  resolve: {
    modules: [
      'app/src/js/',
      'node_modules'
    ],
    alias: {
      tmpl: "blueimp-tmpl",
      cookie: "js-cookie"
    }
  },
  module: {
    rules: [{
        test: /\.html$/,
        use: [{
          loader: "raw-loader"
        }]
      },
      {
        test: /\.json/,
        use: [{
          loader: "json-loader"
        }]
      }
    ]
  }
}

if (process.env.NODE_ENV === 'development') {
  module.exports.devtool = '#source-map'
}