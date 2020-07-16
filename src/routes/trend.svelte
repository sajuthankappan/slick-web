<script>
  import moment from 'moment';
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { currentUser } from '../stores';
  import { getSite, getTrend } from '../helpers/data/reports';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';
  import WebVitals from '../components/WebVitals.svelte';
  import ScoreTrendChart from '../components/ScoreTrendChart.svelte';

  let sitePromise;
  let trendPromise;
  let auditSummaries;
  let auditSummary;
  let siteId;
  let pageId;
  let auditProfile;

  const { page } = stores();
  const { query } = $page;

  $: webVitals = auditSummary && auditSummary.webVitals;
  $: score = auditSummary && Math.round(auditSummary.categories.performance.score * 100);
  $: reportId = auditSummary && auditSummary.auditDetailId.$oid;

  async function retrieveSite() {
    auditSummary = null;
    auditSummaries = null;

    const idToken = await $currentUser.getIdToken();
    const site = await getSite(siteId, idToken);
    if (site && site.pages && site.pages.length > 0) {
      pageId = site.pages[0].id;
      auditProfile = site.auditProfiles[0];
    }
    return site;
  }

  async function retrieveTrend() {
    auditSummary = null;
    const idToken = await $currentUser.getIdToken();
    const trend = await getTrend(siteId, pageId, auditProfile.id, idToken);
    auditSummaries = trend;
    return trend;
  }

  onMount(async () => {
    if (query && query.siteId) {
      siteId = query.siteId;
      sitePromise = retrieveSite();
    }
  });

  async function handleRetrieveSiteClicked(e) {
    e.preventDefault();
    siteId = e.detail.id;
    sitePromise = retrieveSite();
    trendPromise = null;
  }

  async function handleSelectPageClicked(selectedPage, i) {
    pageId = selectedPage.id;
    trendPromise = retrieveTrend();
  }

  async function handleSelectProfileClicked(profile, i) {
    auditProfile = profile;
    trendPromise = retrieveTrend();
  }

  async function handleChartClicked(e) {
    auditSummary = null;
    const clickedIndex = e.detail.index;
    if (clickedIndex >= 0) {
      auditSummary = auditSummaries[clickedIndex];
    }
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
      id={siteId}
      showVersion={false}
      on:retrieve={handleRetrieveSiteClicked}
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
                  <tr class:has-background-grey-light={page.id === pageId}>
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
                  <tr class:has-background-grey-light={profile.id === auditProfile.id}>
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
        <div>
          <ScoreTrendChart data={summaries} on:chartclick={handleChartClicked} />
        </div>
        <div>
          {#if webVitals}
            <div class="box">
              <div class="columns">
                <div class="column">
                  <div>
                    Run: {auditSummary.siteRunId}
                  </div>
                  <div>
                    Date: {moment(auditSummary.fetchTime).calendar()}
                  </div>
                </div>
                <div class="column">
                  <div>
                    Score: {score} (Lighouse {auditProfile.lighthouseVersion})
                  </div>
                  <div>
                    Report: <a href={`/report/?id=${reportId}`}>{reportId}</a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <WebVitals data={webVitals} />
            </div>
          {/if}
        </div>
      {/if}
    {:catch error}
      <HttpError {error} />
    {/await}
  </section>
</div>
