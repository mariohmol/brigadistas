'use strict';

const webpack = require('webpack');

const atlQueryForTest = { // stands for 'awesome-typescript-loader query'
  library: 'es6',
  useBabel: true,
  babelOptions: {
    presets: ['es2015'],
    plugins: ['babel-plugin-espower'] // []
  },
  useCache: true,
  doTypeCheck: false
};


module.exports = {
  entry: ['./test/app/boot.ts'],
  output: {
    path: './test/.bundles',
    filename: 'webpack.bundle.spec.espowered.js',
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /typings/],
        loader: 'awesome-typescript-loader',
        query: atlQueryForTest
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  },
  devtool: 'inline-source-map',
};
