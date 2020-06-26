<script>
  import { onMount } from "svelte";
  import { currentUser, siteId, siteTreadId, pageId } from "../stores";
  import { getSite, getSiteTreads } from "../helpers/data/reports";
  import Loading from "../components/Loading.svelte";
  import HttpError from "../components/HttpError.svelte";
  import IdPickerLevel from "../components/IdPickerLevel.svelte";
  import WebVitals from '../components/WebVitals.svelte';

  let sitePromise;
  let siteTreadsPromise;
  let isMobile = true;
  let device = 'mobile';
  let lhVersion = '6.0.0';
  let siteTread;
  let pageIndex = 0;

  $: webVitals = siteTread && siteTread.pageAuditSummaries[pageIndex].auditSummaries[`${device}-${lhVersion}`].webVitals;
  $: score = siteTread && siteTread.pageAuditSummaries[pageIndex].auditSummaries[`${device}-${lhVersion}`].categories.performance.score;
  $: reportId = siteTread && siteTread.pageAuditSummaries[pageIndex].auditSummaries[`${device}-${lhVersion}`].auditDetailId.$oid;

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

  async function handleRetrieveSiteClicked(e) {
    e.preventDefault();
    siteId.set(e.detail.id);
    sitePromise = retrieveSite();
    siteTreadsPromise = retrieveSiteTreads();
  }

  async function handleSelectPageClicked(page, i) {
    pageId.set(page.name);
    pageIndex = i;
  }

  async function handleMobileSelected() {
    isMobile = true;
    device = 'mobile';
  }

  async function handleDesktopSelected() {
    isMobile = false;
    device = 'desktop';
  }

  async function handleSelectTreadClicked(tread) {
    siteTreadId.set(tread._id.$oid);
    siteTread = tread;
  }

  async function handleVersionChanged(e) {
    lhVersion = e.detail.lhVersion;
  }
</script>

<svelte:head>
  <title>Site | Slick</title>
</svelte:head>

<div class="container">
  <div class="box">
    <h1 class="title has-text-centered">Site</h1>
  </div>

  <section class="section">
    <IdPickerLevel
      label="Site ID"
      id={$siteId}
      on:retrieve={handleRetrieveSiteClicked}
      on:versionChange={handleVersionChanged}
    />

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each site.pages as page, i}
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
                        handleSelectPageClicked(page, i);
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
        <div class="columns">
          <div class="column is-one-third">
            <table class="table">
              <caption>Treads</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each treads as tread}
                  <tr>
                    <td>
                      {tread._id.$oid}
                    </td>
                    <td>
                      <div class="buttons">
                        <button
                          class="button is-small"
                          on:click={() => {
                            handleSelectTreadClicked(tread);
                          }}>
                          &gt;
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <div class="column">
            <div class="tabs">
              <ul>
                <li class:is-active={isMobile} on:click={handleMobileSelected}><a>Mobile</a></li>
                <li class:is-active={!isMobile} on:click={handleDesktopSelected}><a>Desktop</a></li>
              </ul>
            </div>
            {#if webVitals}
              <div class="has-text-weight-bold is-italic pb-2">Score: {score} (Lighouse {lhVersion}) / Report ID: {reportId}</div>
              <WebVitals webVitals={webVitals} />
            {/if}
          </div>
        </div>
      {/if}
    {:catch error}
      <HttpError {error} />
    {/await}
  </section>
</div>
