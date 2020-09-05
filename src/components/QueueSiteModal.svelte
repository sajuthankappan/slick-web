<script>
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { currentUser } from '../stores';
  import { queueSite } from '../helpers/data/reports';
  import HttpError from './HttpError.svelte';
  import Loading from './Loading.svelte';

  export let siteId;
  export let authentication;

  let isActive = true;
  let needsAuthentication;
  let authenticationCookieName = '';
  let authenticationCookieValue = '';
  let queuePromise;

  if (authentication) {
    needsAuthentication = true;
    authenticationCookieName = authentication.cookie && authentication.cookie.name;
  }

  const dispatch = createEventDispatcher();

  async function handleCloseClicked(e) {
    e.preventDefault();
    isActive = false;
    dispatch('close', { message: 'Cancelled' });
  }

  async function handleSubmitted(e) {
    e.preventDefault();
    const queueParameters = {
      siteId,
    };
    if (needsAuthentication) {
      queueParameters.cookie = {
        name: authenticationCookieName,
        value: authenticationCookieValue,
      };
    }
    const idToken = await $currentUser.getIdToken();
    queuePromise = queueSite(queueParameters, idToken);
  }
</script>

<div class="modal" class:is-active={isActive} >
  <form on:submit={handleSubmitted}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Queue New Run</p>
        <button class="delete" aria-label="close"  on:click={handleCloseClicked} />
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Site ID</label>
          <div class="control">
            <input class="input" type="text" bind:value={siteId} readonly>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" bind:checked={needsAuthentication}>
              Needs Authentication
            </label>
          </div>
        </div>
        {#if needsAuthentication}
          <div class="field" slide>
            <label class="label">Cookie Name</label>
            <div class="control">
            <input class="input" type="text" bind:value={authenticationCookieName} required>
            </div>
          </div>
          <div class="field" in:slide>
            <label class="label">Cookie Value</label>
            <div class="control">
            <input class="input" type="text" bind:value={authenticationCookieValue} required>
            </div>
          </div>
        {/if}
        {#if queuePromise}
          {#await queuePromise}
            <Loading />
          {:then status}
            <div class="notification is-success" in:slide>
              {status && status.message}
            </div>
          {:catch error}
            <HttpError {error} />
          {/await}
        {/if}
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" type="submit">Queue</button>
        <button class="button" on:click={handleCloseClicked}>Close</button>
      </footer>
    </div>
  </form>
</div>
