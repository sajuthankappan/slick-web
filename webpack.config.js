const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');
const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');

dotenv.config()

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const firebaseApiKey=process.env.SLICK_FIREBASE_API_KEY;
const firebaseProjectId = process.env.SLICK_FIREBASE_PROJECT_ID;
const firebaseAuthDomain = firebaseProjectId + '.firebaseapp.com';
const firebaseDatabaseUrl = `https://${firebaseProjectId}.firebaseio.com`;
const firebaseMessagingSenderId = process.env.SLICK_FIREBASE_MESSAGING_SENDER_ID;
const firebaseStorageBucket = `${firebaseProjectId}.appspot.com`;
const firebaseAppId = process.env.SLICK_FIREBASE_APP_ID;
const apiBaseUrl = process.env.SLICK_API_BASE_URL;

const alias = { svelte: path.resolve('node_modules', 'svelte') };
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: { alias, extensions, mainFields },
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              dev,
              hydratable: true,
              hotReload: false, // pending https://github.com/sveltejs/svelte/issues/2377
              preprocess: require('svelte-preprocess')({ /* options */ })
            }
          }
        }
      ]
    },
    mode,
    plugins: [
      // pending https://github.com/sveltejs/svelte/issues/2377
      // dev && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.SLICK_FIREBASE_API_KEY': JSON.stringify(firebaseApiKey),
        'process.env.SLICK_FIREBASE_PROJECT_ID': JSON.stringify(firebaseProjectId),
        'process.env.SLICK_FIREBASE_AUTH_DOMAIN': JSON.stringify(firebaseAuthDomain),
        'process.env.SLICK_FIREBASE_DATABASE_URL': JSON.stringify(firebaseDatabaseUrl),
        'process.env.SLICK_FIREBASE_STORAGE_BUCKET': JSON.stringify(firebaseStorageBucket),
        'process.env.SLICK_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(firebaseMessagingSenderId),
        'process.env.SLICK_FIREBASE_APP_ID': JSON.stringify(firebaseAppId),
        'process.env.SLICK_API_BASE_URL': JSON.stringify(apiBaseUrl),
      }),
    ].filter(Boolean),
    devtool: dev && 'inline-source-map'
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: 'node',
    resolve: { alias, extensions, mainFields },
    externals: Object.keys(pkg.dependencies).concat('encoding'),
    module: {
      rules: [
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              css: false,
              generate: 'ssr',
              dev,
              preprocess: require('svelte-preprocess')({ /* options */ })
            }
          }
        }
      ]
    },
    mode: process.env.NODE_ENV,
    performance: {
      hints: false // it doesn't matter if server.js is large
    }
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode: process.env.NODE_ENV
  }
};
