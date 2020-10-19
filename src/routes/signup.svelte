<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { goto } from '@sapper/app';
  import { currentUser } from '../stores';
  import HttpError from '../components/HttpError.svelte';
  import Loading from '../components/Loading.svelte';
  import { register } from '../helpers/data/user';
  import { signOut } from '../helpers/firebase/auth';

  let registrationCode;
  let signupPromise;

  async function handleSignOut() {
    await signOut();
    goto('/login');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const idToken = await $currentUser.getIdToken();
    signupPromise = register(registrationCode, idToken);
  }
</script>

<svelte:head>
  <title>Sign Up | Svelte</title>
</svelte:head>

<div class="container">
  <div class="box">
    <h1 class="title has-text-centered">Sign Up</h1>
  </div>
  <form on:submit={handleSubmit}>
    {#if signupPromise}
      {#await signupPromise}
        <Loading />
      {:then response}
        <div class="notification is-success">
          <div>{response.message}</div>
          <div>Re-login for the changes to take effect</div>
        </div>
        <button class="button is-primary" on:click={handleSignOut}>Signout & Go to Login Page</button>
      {:catch error}
        {#if error.code === 404}
          <div class="notification is-danger">Reigstrtion code is invalid</div>
        {:else}
          <HttpError {error} />
        {/if}
      {/await}
    {:else}
      <div class="field">
          <label class="label" for="siteId">Registration Code</label>
          <div class="control">
          <input class="input" type="text" id="siteId" bind:value={registrationCode} required>
          </div>
      </div>
      <div class="buttons">
          <button type="submit" class="button is-primary">
              Complete Sign Up
          </button>
          <button class="button is-secondary is-outlined" on:click={handleSignOut}>
              Sign out
          </button>
      </div>
    {/if}
  </form>
</div>