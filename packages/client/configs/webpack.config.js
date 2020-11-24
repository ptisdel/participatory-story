const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const buildDir = path.join(__dirname, '../build');
const srcDir = path.join(__dirname, 'src');
const srcIndex = path.join(__dirname, '../src/index.html');

module.exports = {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    path: buildDir,
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_DATABASE_URL',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_STORAGE_BUCKET',
      'REACT_APP_FIREBASE_MESSAGE_SENDER_ID',
      'REACT_APP_FIREBASE_APP_ID',
      'REACT_APP_FIREBASE_VAPID_KEY',
    ]),
    new HtmlWebpackPlugin({
      template: srcIndex,
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  devServer: {
    compress: true,
    contentBase: srcDir,
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 8002,
  },
};
