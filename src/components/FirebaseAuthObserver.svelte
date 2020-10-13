<script>
  import { beforeUpdate } from 'svelte';
  import { goto } from '@sapper/app';
  import NProgress from 'nprogress';
  import { currentUser, loading, currentUserClaims } from '../stores.js';
  import { firebaseConfig } from '../helpers/firebase/config.js';
  import { ensureSlickUser } from '../helpers/firebase/auth.js';

  export let segment;

  const initFirebaseApp = async function() {
    loading.set(true);
    const firebaseAppModule = await import("firebase/app");
    const firebase = firebaseAppModule.default;
    const firebaseAuthModule = await import("firebase/auth");

    firebase.apps.length || firebase.initializeApp(firebaseConfig);

    try {
      NProgress.start();
      firebase.auth().onAuthStateChanged(
        async function(user) {
          if (user) {
            console.log("User is signed in.");

            try {
              const claims = await ensureSlickUser(user);
              currentUser.set(user);
              currentUserClaims.set(claims);
              loading.set(false);
            } catch (error) {
              console.error(error);
              loading.set(false);
              await firebase.auth().signOut();
              gotoLogin(segment);
            } finally {
              NProgress.done();
            }
          } else {
            console.log("User not signed in / User is signed out.");
            currentUser.set(null);
            loading.set(false);
            NProgress.done();
            gotoLogin(segment);
          }
        },
        function(error) {
          console.error(error);
          loading.set(false);
          NProgress.done();
          gotoLogin(segment);
        }
      );
    } catch (error) {
      console.error(error);
      NProgress.done();
      gotoLogin(segment);
    }
  };

  beforeUpdate(async () => {
    await initFirebaseApp();
  });

  function gotoLogin(segment) {
    switch (segment) {
      case 'report':
      case 'login':
        //don't need do anything
        break;
    
      default:
        goto('/login');
        break;
    }
  }
</script>
