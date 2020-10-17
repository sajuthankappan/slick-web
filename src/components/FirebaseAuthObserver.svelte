<script>
  import { beforeUpdate } from 'svelte';
  import { goto } from '@sapper/app';
  import NProgress from 'nprogress';
  import { currentUser, loading, currentUserClaims } from '../stores.js';
  import { isSlickUser, signOut } from '../helpers/firebase/auth.js';
  import { firebaseConfig } from '../helpers/firebase/config.js';

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
              currentUser.set(user);
              const claims = await isSlickUser(user);
              loading.set(false);
              if (claims) {
                currentUserClaims.set(claims);
                console.log("valid slick user");
              } else {
                goto('/signup');
              }
              
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
      case 'signup':
      case 'login':
        //don't need do anything
        break;
    
      default:
        goto('/login');
        break;
    }
  }
</script>
