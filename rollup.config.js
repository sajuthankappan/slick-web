import dotenv from 'dotenv';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup';
import wasm from '@rollup/plugin-wasm';
import sveltePreprocess from 'svelte-preprocess';
import purgecss from '@fullhuman/postcss-purgecss';
import pkg from './package.json';

dotenv.config();

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;
const firebaseApiKey = process.env.SLICK_FIREBASE_API_KEY;
const firebaseProjectId = process.env.SLICK_FIREBASE_PROJECT_ID;
// const firebaseAuthDomain = firebaseProjectId + '.firebaseapp.com';
const firebaseAuthDomain = process.env.SLICK_FIREBASE_AUTH_DOMAIN;
const firebaseDatabaseUrl = `https://${firebaseProjectId}.firebaseio.com`;
const firebaseMessagingSenderId = process.env.SLICK_FIREBASE_MESSAGING_SENDER_ID;
const firebaseStorageBucket = `${firebaseProjectId}.appspot.com`;
const firebaseAppId = process.env.SLICK_FIREBASE_APP_ID;
const apiBaseUrl = process.env.SLICK_API_BASE_URL;
const stravaAuthorizeUrl = process.env.SLICK_STRAVA_AUTHORIZE_URL;

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

const preprocess = sveltePreprocess({
  scss: {
    includePaths: ['src'],
  },
  postcss: ({
    plugins: [purgecss({
      content: [
        './src/routes/**/*.*',
        './src/components/**/*.*',
        './src/template.html',
      ],
    })],
  }),
});

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
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
        'process.env.SLICK_STRAVA_AUTHORIZE_URL': JSON.stringify(stravaAuthorizeUrl),
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        preprocess,
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),

      legacy && babel({
        extensions: ['.js', '.mjs', '.html', '.svelte'],
        runtimeHelpers: true,
        exclude: ['node_modules/@babel/**'],
        presets: [
          ['@babel/preset-env', {
            targets: '> 0.25%, not dead',
          }],
        ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          ['@babel/plugin-transform-runtime', {
            useESModules: true,
          }],
        ],
      }),

      !dev && terser({
        module: true,
      }),

      wasm(),
    ],

    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      svelte({
        generate: 'ssr',
        dev,
        preprocess,
      }),
      resolve({
        dedupe: ['svelte'],
      }),
      commonjs(),
      wasm(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules || Object.keys(process.binding('natives')),
    ),

    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      commonjs(),
      !dev && terser(),
    ],

    onwarn,
  },
};
