// eslint-disable-next-line import/no-extraneous-dependencies
import * as sapper from '@sapper/app';
import sfetch from './helpers/data/slick-fetch';

sfetch.init({
  baseUrl: process.env.SLICK_API_BASE_URL,
});

sapper.start({
  target: document.querySelector('#sapper'),
});
