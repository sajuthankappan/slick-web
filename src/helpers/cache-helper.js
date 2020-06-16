import { info } from './logger';

// eslint-disable-next-line import/prefer-default-export
export function clearDataCache() {
  if (!navigator.serviceWorker.controller) {
    return 'Warning! No ServiceWorker';
  }

  info('Clearing cache..');
  navigator.serviceWorker.controller.postMessage({
    command: 'clearCache',
    message: 'all',
  });
  return 'Cleared cached data';
}
