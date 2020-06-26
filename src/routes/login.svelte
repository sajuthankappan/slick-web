<script>
  import { goto } from '@sapper/app';
  import { firebaseConfig } from '../helpers/firebase/config.js';
  import { onMount } from 'svelte';

  let email, password;

  let firebase;

  onMount(async () => {
    const firebaseAppModule = await import('firebase/app');
    firebase = firebaseAppModule.default;
    const firebaseAuthModule = await import('firebase/auth');
  });

  async function handleGoogleLoginClick() {
    firebase.apps.length || firebase.initializeApp(firebaseConfig);

    try {
      let provider = new firebase.auth.GoogleAuthProvider();
      let result = await firebase.auth().signInWithPopup(provider);
      goto('/');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleLoginClick() {
    firebase.apps.length || firebase.initializeApp(firebaseConfig);

    try {
      let result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      goto('/');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
</script>

<svelte:head>
  <title>Sign In | Slick</title>
</svelte:head>

<div class="container">
  <div class="box">
    <h1 class="title is-1 has-text-centered">Sign In</h1>
  </div>

  <div class="field">
    <label class="label">Email</label>
    <div class="control">
      <input
        type="text"
        class="input is-primary"
        placeholder="email"
        bind:value={email} />
    </div>
  </div>

  <div class="field">
    <label class="label">Password</label>
    <div class="control">
      <input
        type="password"
        class="input is-primary"
        placeholder="password"
        bind:value={password} />
    </div>
  </div>

  <div class="field is-grouped">
    <div class="control">
      <button class="button is-primary" on:click={handleLoginClick}>
        Sign in
      </button>
    </div>
    <div class="control">
      <button class="button is-primary" on:click={handleGoogleLoginClick}>
        Sign in using Google
      </button>
    </div>
  </div>
</div>
