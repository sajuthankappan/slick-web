<script>
  import { onMount } from "svelte";
  import { currentUser, siteId, siteRunId, pageId, auditProfileId } from "../stores";
  import { getSite, getTrend } from "../helpers/data/reports";
  import Loading from "../components/Loading.svelte";
  import HttpError from "../components/HttpError.svelte";
  import IdPickerLevel from "../components/IdPickerLevel.svelte";
  import WebVitals from '../components/WebVitals.svelte';

  let sitePromise;
  let trendPromise;
  let isMobile = true;
  let device = 'mobile';
  let lhVersion = '6.0.0';
  let auditSummary;
  let pageIndex = 0;
  let profileIndex = 0;

  $: webVitals = auditSummary && auditSummary.webVitals;
  $: score = auditSummary && auditSummary.categories.performance.score;
  $: reportId = auditSummary && auditSummary.auditDetailId.$oid;

  async function retrieveSite() {
    auditSummary = null;
    const idToken = await $currentUser.getIdToken();
    const site = await getSite($siteId, idToken);
    if (site && site.pages && site.pages.length > 0) {
      pageId.set(site.pages[0].id);
      auditProfileId.set(site.auditProfiles[0].id);
    }
    return site;
  }

  async function retrieveTrend() {
    auditSummary = null;
    const idToken = await $currentUser.getIdToken();
    const trend = await getTrend($siteId, $pageId, $auditProfileId, idToken);
    return trend;
  }

  onMount(async () => {
    // promise = retrieve();
  });

  async function handleRetrieveSiteClicked(e) {
    e.preventDefault();
    siteId.set(e.detail.id);
    sitePromise = retrieveSite();
    //siteTreadsPromise = retrieveSiteTreads();
  }

  async function handleSelectPageClicked(page, i) {
    pageId.set(page.id);
    pageIndex = i;
    trendPromise = retrieveTrend();
  }

  async function handleSelectProfileClicked(profile, i) {
    auditProfileId.set(profile.id);
    profileIndex = i;
    trendPromise = retrieveTrend();
  }

  async function handleSelectRunClicked(summary) {
    siteRunId.set(summary.siteRunId);
    auditSummary = summary;
  }

  async function handleVersionChanged(e) {
    lhVersion = e.detail.lhVersion;
  }
</script>

<svelte:head>
  <title>Trend | Slick</title>
</svelte:head>

<div class="container">
  <div class="box">
    <h1 class="title has-text-centered">Trend</h1>
  </div>

  <section class="section">
    <IdPickerLevel
      label="Site ID"
      id={$siteId}
      showVersion={false}
      on:retrieve={handleRetrieveSiteClicked}
      on:versionChange={handleVersionChanged}
    />

    {#await sitePromise}
      <Loading />
    {:then site}
      {#if site}
        <div class="columns">
          <div class="column">
            <table class="table">
              <caption>Pages</caption>
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
            <div>Selected Page: {$pageId}</div>
          </div>
          <div class="column">
            <table class="table">
              <caption>Profiles</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each site.auditProfiles as profile, i}
                  <tr>
                    <th>{profile.id}</th>
                    <td>{profile.name}</td>
                    <td>
                      <div class="buttons">
                        <button
                          class="button is-small"
                          on:click={() => {
                            handleSelectProfileClicked(profile, i);
                          }}>
                          Select
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            <div>Selected Profile: {$auditProfileId}</div>
          </div>
        </div>
      {/if}
    {:catch error}
      <HttpError {error} />
    {/await}
    {#await trendPromise}
      <Loading />
    {:then summaries}
      {#if summaries}
        <div class="columns">
          <div class="column is-one-third">
            <table class="table">
              <caption>Runs</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each summaries as summary}
                  <tr>
                    <td>
                      {summary.siteRunId}
                    </td>
                    <td>
                      <div class="buttons">
                        <button
                          class="button is-small"
                          on:click={() => {
                            handleSelectRunClicked(summary);
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
            {#if webVitals}
              <div class="has-text-weight-bold is-italic pb-2">Score: {score} (Lighouse {lhVersion}) / Report ID: {reportId}</div>
              <WebVitals data={webVitals} />
            {/if}
          </div>
        </div>
      {/if}
    {:catch error}
      <HttpError {error} />
    {/await}
  </section>
</div>
