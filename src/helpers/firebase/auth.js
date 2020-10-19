import firebase from 'firebase/app';
import { firebaseConfig } from './config';

export async function ensureSlickUser(user) {
  const idTokenResult = await user.getIdTokenResult();

  if (idTokenResult.claims && idTokenResult.claims.slickUser) {
    return idTokenResult.claims;
  }

  // eslint-disable-next-line no-alert
  alert('Please contact admin to enable your account!');
  throw new Error('Not slick user');
}

export async function isSlickUser(user) {
  const idTokenResult = await user.getIdTokenResult();

  if (idTokenResult.claims && idTokenResult.claims.slickUser) {
    return idTokenResult.claims;
  }

  return false;
}

export async function getRider() {
  throw new Error('Not implemented');
}

export async function signOut() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  try {
    await firebase.auth().signOut();
  } catch (error) {
    throw new Error(error);
  }
}
