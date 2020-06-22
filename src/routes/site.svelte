<script>
  import { onMount } from 'svelte';
  import { currentUser, siteId, pageId } from '../stores';
  import { getSite } from '../helpers/data/reports';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';

  let promise;

  async function retrieve() {
    const idToken = await $currentUser.getIdToken();
    const site = await getSite($siteId, idToken);
    return site;
  }

  onMount(async () => {
    // promise = retrieve();
  });

  async function handleRetrieveClicked(e) {
    e.preventDefault();
    siteId.set(e.detail.id);
    promise = retrieve();
  }

  async function handleSelectPageClicked(pageName) {
    pageId.set(pageName);
  }
</script>

<svelte:head>
  <title>Sites</title>
</svelte:head>

<div class="container">
  <div class="box">
    <h1 class="title has-text-centered">Select Site / Page</h1>
  </div>

  <section class="section">
    <IdPickerLevel
      label="Site ID"
      initialId={$siteId}
      on:retrieve={handleRetrieveClicked} />

    {#await promise}
      <Loading />
    {:then site}
      {#if site}
        <table class="table">
          <caption>{site.name}</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Url</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {#each site.pages as page}
              <tr>
                <th>{page.name}</th>
                <td>
                  <a href={page.url}>{page.url}</a>
                </td>
                <td>
                  <div class="buttons">
                    <button class="button is-small" on:click={() => { handleSelectPageClicked(page.name); }}>Select</button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div>Selected page: {$pageId}</div>
      {/if}
    {:catch error}
      <HttpError {error} />
    {/await}
  </section>
</div>
