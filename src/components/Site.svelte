<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { addSite, updateSite } from '../helpers/data/site';
  import { currentUser } from '../stores';
  import Loading from './Loading.svelte';
  import HttpError from './HttpError.svelte';

  export let site;

  let saveSitePromise;
  let isActive = true;
  let needsAuthentication = false;

  const dispatch = createEventDispatcher();

  onMount(async () => {
    if (site.authentication) {
      needsAuthentication = true;
    }
  });

  async function handleSubmitted(e) {
    e.preventDefault();

    if (site._id) {
      const idToken = await $currentUser.getIdToken();
      saveSitePromise = updateSite(site, idToken);
    } else {
      const idToken = await $currentUser.getIdToken();
      saveSitePromise = addSite(site, idToken);
    }
    
  }

  async function handleCloseClicked(e) {
    e.preventDefault();
    isActive = false;
    dispatch('close', { message: 'Cancelled' });
  }
</script>

<div class="modal" class:is-active={isActive}>
  <form on:submit={handleSubmitted} >
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Site</p>
        <button class="delete" aria-label="close"  on:click={handleCloseClicked} />
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label" for="siteId">Site ID</label>
          <div class="control">
            {#if site._id}
              <input class="input" type="text" id="siteId" bind:value={site._id.$oid} readonly />
            {:else}
            <input class="input" type="text" id="siteId" value="To be generated" readonly />
            {/if}
          </div>
        </div>
        <div class="field">
          <label class="label" for="name">Name</label>
          <div class="control">
            <input class="input" type="text" id="name" bind:value={site.name} required/>
          </div>
        </div>
        <div class="py-4">
          <table class="table">
            <caption>Pages</caption>
            <thead>
              <tr>
                <th>Page ID</th>
                <th>Name</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {#each site.pages as page}
              <tr>
                <td>
                  <input class="input" type="text" bind:value={page.id} required readonly/>
                </td>
                <td>
                  <input class="input" type="text" bind:value={page.name} required/>
                </td>
                <td>
                  <input class="input" type="url" bind:value={page.url} required/>
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="py-4">
          <table class="table p-4">
            <caption>Profiles</caption>
            <thead>
              <tr>
                <th>Profile ID</th>
                <th>Name</th>
                <th>Device</th>
                <th>LH Version</th>
              </tr>
            </thead>
            <tbody>
              {#each site.auditProfiles as profile}
                <tr>
                  <td>
                    <input class="input" type="text" bind:value={profile.id} required readonly />
                  </td>
                  <td>
                    <input class="input" type="text" bind:value={profile.name} required />
                  </td>
                  <td>
                    <input class="input" type="text" bind:value={profile.device} required readonly />
                  </td>
                  <td>
                    <input class="input" type="text" bind:value={profile.lighthouseVersion} required readonly />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" bind:checked={needsAuthentication} disabled>
                Needs Authentication
            </label>
          </div>
        </div>
        {#if needsAuthentication}
          <div class="field" slide>
            <label class="label" for="authenticationCookieName">Cookie Name</label>
            <div class="control">
            <input class="input" type="text" id="authenticationCookieName" bind:value={site.authentication.cookie.name} required>
            </div>
          </div>
        {/if}
        {#if saveSitePromise}
          {#await saveSitePromise}
            <Loading />
          {:then status}
            <div class="notification is-success" in:slide>
              Saved successefully
            </div>
          {:catch error}
            <HttpError {error} />
          {/await}
        {/if}
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" type="submit">Save</button>
        <button class="button" on:click={handleCloseClicked}>Close</button>
      </footer>
    </div>
  </form>
</div>