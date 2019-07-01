// +require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var helpers = require('./helpers');

var projectRootPath = path.resolve(__dirname, '../');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;

// var MiniCssExtractPlugin = require("mini-css-extract-plugin");
// var {CleanWebpackPlugin} = require('clean-webpack-plugin');
var WebappWebpackPlugin = require('webapp-webpack-plugin');
// var ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
var LoadablePlugin = require('@loadable/webpack-plugin');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

// var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
// var CopyPlugin = require('copy-webpack-plugin');

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObject, babelrcObjectDevelopment, { plugins: combinedPlugins });
delete babelLoaderQuery.env;

var validDLLs = helpers.isValidDLLs('vendor', assetsPath);
if (process.env.WEBPACK_DLLS === '1' && !validDLLs) {
  process.env.WEBPACK_DLLS = '0';
  console.warn('webpack dlls disabled');
}

var webpackConfig = module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      './src/client.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, '../src')],
        loader: 'babel-loader',
        options: babelLoaderQuery
      },
      {
        test: /\.json$/,
        include: [path.resolve(__dirname, '../src')],
        loader: 'json-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: false,
          mimetype: 'application/font-woff'
        }
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: false,
          mimetype: 'application/octet-stream'
        }
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'image/svg+xml'
        },
        // exclude: [path.resolve(__dirname, '../src/components/CoinsSvg/Svg')]
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          mimetype: 'image/svg+xml'
        },
        // include: [path.resolve(__dirname, '../src/components/CoinsSvg/Svg')]
      }, {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader',
        options: {
          limit: 10240
        }
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: { quality: 65 },
          optinpng: { optimizationLevel: 7 },
          gifsicle: { interlaced: false },
          pngquant: {
            quality: '65-90',
            speed: 4
          }
        }
      }
    ]
  },
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.mjs', '.json', '.js', '.jsx'],
    alias: {
      modernizr$: projectRootPath + '/.modernizrrc.js',
      'immutable': projectRootPath + '/node_modules/immutable',
      'classnames': projectRootPath + '/node_modules/clsx',
      'load-image': 'blueimp-load-image/js/load-image.js',
      'load-image-meta': 'blueimp-load-image/js/load-image-meta.js',
      'load-image-exif': 'blueimp-load-image/js/load-image-exif.js',
      'canvas-to-blob': 'blueimp-canvas-to-blob/js/canvas-to-blob.js',
      'jquery-ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      'jquery-ui/ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      'react-dom': '@hot-loader/react-dom'
    }
  },
  plugins: [
    new webpack.ProgressPlugin(),

    // hot reload
    new webpack.HotModuleReplacementPlugin(),

    new webpack.IgnorePlugin(/webpack-stats\.json$/),

    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    }),

    webpackIsomorphicToolsPlugin.development(),

    new LoadablePlugin(),

  ]
};