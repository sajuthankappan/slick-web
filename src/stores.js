// eslint-disable-next-line import/no-extraneous-dependencies
import { writable } from 'svelte/store';

export const currentUser = writable(null);
export const currentUserClaims = writable(null);
export const loading = writable(true);
export const siteId = writable('');
export const pageId = writable('');
export const reportId = writable('');
