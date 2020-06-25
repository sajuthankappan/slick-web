<script>
  import { onMount } from "svelte";
  import { currentUser, siteId, pageId } from "../stores";
  import { getSite, getSiteTreads } from "../helpers/data/reports";
  import Loading from "../components/Loading.svelte";
  import HttpError from "../components/HttpError.svelte";
  import IdPickerLevel from "../components/IdPickerLevel.svelte";

  let sitePromise;
  let siteTreadsPromise;

  async function retrieveSite() {
    const idToken = await $currentUser.getIdToken();
    const site = await getSite($siteId, idToken);
    return site;
  }

  async function retrieveSiteTreads() {
    const idToken = await $currentUser.getIdToken();
    const siteTreads = await getSiteTreads($siteId, idToken);
    return siteTreads;
  }

  onMount(async () => {
    // promise = retrieve();
  });

  async function handleRetrieveClicked(e) {
    e.preventDefault();
    siteId.set(e.detail.id);
    sitePromise = retrieveSite();
    siteTreadsPromise = retrieveSiteTreads();
  }

  async function handleSelectPageClicked(pageName) {
    pageId.set(pageName);
  }

  async function handleSelectTreadClicked(treadId) {
    siteId.set(treadId);
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
      id={$siteId}
      on:retrieve={handleRetrieveClicked} />

    {#await sitePromise}
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
                    <button
                      class="button is-small"
                      on:click={() => {
                        handleSelectPageClicked(page.name);
                      }}>
                      Select
                    </button>
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
    {#await siteTreadsPromise}
      <Loading />
    {:then treads}
      {#if treads}
        <table class="table">
          <caption>Treads</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {#each treads as tread}
              <tr>
                <th>{tread.siteName}</th>
                <td>
                  {tread._id.$oid}
                </td>
                <td>
                  <div class="buttons">
                    <button
                      class="button is-small"
                      on:click={() => {
                        handleSelectTreadClicked(tread.siteId.$oid);
                      }}>
                      Select
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div>Selected tread: {$siteId}</div>
      {/if}
    {:catch error}
      <HttpError {error} />
    {/await}
  </section>
</div>
