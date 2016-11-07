const path = require('path');
const webpack = require('webpack');
const webpack_dev_server = require('webpack-dev-server');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const base = "bundle";
const NODE_ENV = process.env.NODE_ENV || 'staging';
const isProd = process.env.NODE_ENV === 'production';
const IP = process.env.IP || "http://139.59.241.214:3000/v1/";

console.log(NODE_ENV, IP, isProd)

function getPlugins() {

  var env_var = {
    "process.env": {
      "NODE_ENV": JSON.stringify(NODE_ENV),
      "IP": JSON.stringify(IP)
    }
  };

  var plugins = [
    new webpack.NoErrorsPlugin(), // prevent bundling if there's erroneous codes,
    new ExtractTextPlugin(`${base}.[name].css`),
    new webpack.ProvidePlugin({$: "jquery", jquery: "jquery"}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(env_var)
  ];

  if (isProd) {
    // production
    console.log(`Running ${process.env.NODE_ENV} mode`);
    plugins.push(new webpack.optimize.UglifyJsPlugin());

  } else {
    // development
    console.log("Running development mode");
  }
  return plugins;
}

function getDevServer() {
  if (isProd){
    return {};
  }
  return {
      contentBase: './CodeQuiz/static',
      hot: true
  };
}

function getEntries(){
  entries = [
    './src/index.js' // Entry path for bundling process
  ];
  if (!isProd) {
    entries.push('webpack-dev-server/client?http://localhost:8081'); //client portion of dev server
    entries.push('webpack/hot/only-dev-server'); // hot loading
  }
  return entries;
}

module.exports = {
    devServer: getDevServer(),
    entry: getEntries(),
    output: {
        path: './CodeQuiz/static',
        filename: `${base}.[name].js`, // where my bundle is stored
        publicPath: '/'
    },
    plugins: getPlugins(),
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {
                // css
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            // Fonts and Pictures
            {
                test: /\.woff(\d+)?$/,
                loader: 'url?prefix=font/&limit=5000&mimetype=application/font-woff'
            }, {
                test: /\.ttf$/,
                loader: 'file?prefix=font/'
            }, {
                test: /\.eot$/,
                loader: 'file?prefix=font/'
            }, {
                test: /\.svg$/,
                loader: 'file?prefix=font/'
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            // javascript
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    }
}
