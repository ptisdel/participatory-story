const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest')
const CopyPlugin = require('copy-webpack-plugin');

const buildDir = path.join(__dirname, '../build');
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
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            },
          },
        ],
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
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].js',
    path: buildDir,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/public', to: './' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: srcIndex,
    }),
    new WebpackPwaManifest({
      filename: 'manifest.json',
      orientation: 'portrait',
      name: 'Participatory Story',
      short_name: 'Async DnD',
      description: 'A webapp for async DnD-style story creation',
      background_color: '#ffffff',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      icons: [{
        destination: 'assets',
        src: path.resolve('src/public/favicon.png'),
        type: 'image/png',
        size: '256x256'
      }],
    }),
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
