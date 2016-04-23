
var webpack = require('webpack');

var definedVars = {
  'process.env.NODE_ENV': '"development"',
};

module.exports = {
  entry: [
    'webpack-dev-server/client?http://panda.dev:' + process.env.PORT + '/',
    'webpack/hot/dev-server',
    './app',
  ],
  output: {
    path: __dirname + '/assets',
    publicPath: '/assets',
    filename: 'app.js',
  },
  devServer: {
    contentBase: __dirname + '/assets',
    host: '0.0.0.0',
    port: process.env.PORT,
    hot: true,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    }
  },
  cache: true,
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(definedVars),
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: [ __dirname ],
        exclude: [ __dirname + '/node_modules' ],
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        include: [ __dirname ],
        exclude: /node_modules/,
        loader: 'react-hot!babel-loader',
      },
      {
        test: /\.css$/,
        include: [ __dirname ],
        loader: 'style-loader!css-loader',
      },
    ],
  },
  node: {
    fs: 'empty',
  },
};