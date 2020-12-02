const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
// const WebpackPwaManifest = require('webpack-pwa-manifest')
const CopyPlugin = require('copy-webpack-plugin');

const buildDir = path.join(__dirname, '../build');
const srcDir = path.join(__dirname, '../src');
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
  // entry: srcDir,
  output: {
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].js',
    path: buildDir,
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
    new CopyPlugin({
      patterns: [
        { from: 'src/public', to: './' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: srcIndex,
    }),
    // new WebpackPwaManifest({
    //   filename: 'manifest.json',
    //   name: 'My Progressive Web App',
    //   short_name: 'MyPWA',
    //   description: 'My awesome Progressive Web App!',
    //   background_color: '#ffffff',
    //   crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
    //   icons: [],
    // }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  devServer: {
    contentBase: buildDir,
    historyApiFallback: true,
    compress: true,
    hot: true,
    inline: true,
    open: true,
    port: 8002,
    writeToDisk: true,
  },
};
