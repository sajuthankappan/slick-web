<script>
  import dayjs from 'dayjs';
  import { onMount } from 'svelte';
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { stores } from '@sapper/app';
  import { currentUser, siteId } from '../stores';
  import { getTrend } from '../helpers/data/report';
  import { getSite } from '../helpers/data/site';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';
  import WebVitals from '../components/WebVitals.svelte';
  import ScoreTrendChart from '../components/ScoreTrendChart.svelte';
  import QueueSiteModal from '../components/QueueSiteModal.svelte';
  import DeleteSummaryModal from '../components/DeleteSummaryModal.svelte';

  let sitePromise;
  let trendPromise;
  let auditSummaries;
  let auditSummary;
  let site;
  let pageId;
  let auditProfile;
  let showQueueSiteModal = false;
  let showDeleteSummaryModal = false;

  const { page } = stores();
  const { query } = $page;

  $: webVitals = auditSummary && auditSummary.webVitals;
  $: score = auditSummary && Math.round(auditSummary.categories.performance.score * 100);
  $: reportId = auditSummary && auditSummary.auditDetailId.$oid;
  // eslint-disable-next-line no-underscore-dangle
  $: auditSummaryId = auditSummary && auditSummary._id.$oid;

  async function retrieveSite() {
    auditSummary = null;
    auditSummaries = null;

    const idToken = await $currentUser.getIdToken();
    site = await getSite($siteId, idToken);
    if (site && site.pages && site.pages.length > 0) {
      pageId = site.pages[0].id;
      [auditProfile] = site.auditProfiles;
    }
    return site;
  }

  async function retrieveTrend() {
    auditSummary = null;
    const idToken = await $currentUser.getIdToken();
    const trend = await getTrend($siteId, pageId, auditProfile.id, idToken);
    auditSummaries = trend;
    return trend;
  }

  onMount(async () => {
    if (query && query.siteId) {
      siteId.set(query.siteId);
    }
  
    if ($siteId) {
      sitePromise = retrieveSite();
    }
  });

  async function handleRetrieveSiteClicked(e) {
    e.preventDefault();
    siteId.set(e.detail.id);
    sitePromise = retrieveSite();
    trendPromise = null;
  }

  async function handleSelectPageClicked(selectedPage) {
    pageId = selectedPage.id;
    trendPromise = retrieveTrend();
  }

  async function handleSelectProfileClicked(profile) {
    auditProfile = profile;
    trendPromise = retrieveTrend();
  }

  async function handleQueueRunClicked() {
    showQueueSiteModal = true;
  }

  async function handleQueueSiteDialogClosed() {
    showQueueSiteModal = false;
  }

  async function handleDeleteSummaryClicked() {
    showDeleteSummaryModal = true;
  }

  async function handleDeleteSummaryDialogClosed() {
    showDeleteSummaryModal = false;
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
      id={$siteId}
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
                {#each site.pages as page}
                  <tr class:is-selected={page.id === pageId}>
                    <th>{page.name}</th>
                    <td>
                      <a href={page.url}>{page.url}</a>
                    </td>
                    <td>
                      <div class="buttons">
                        <button
                          class="button is-small"
                          on:click={() => {
                            handleSelectPageClicked(page);
                          }}>
                          Select
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            <button
              class="button is-link is-outlined"
              on:click={() => {
                handleQueueRunClicked();
              }}>
              Queue New Run
            </button>
            {#if showQueueSiteModal}
              <QueueSiteModal siteId={$siteId} authentication={site.authentication}  on:close={handleQueueSiteDialogClosed} />
            {/if}
          </div>
          <div class="column">
            <table class="table">
              <caption>Profiles</caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {#each site.auditProfiles as profile}
                  <tr class:is-selected={profile.id === auditProfile.id}>
                    <td>{profile.name}</td>
                    <td>{profile.id}</td>
                    <td>
                      <div class="buttons">
                        <button
                          class="button is-small"
                          on:click={() => {
                            handleSelectProfileClicked(profile);
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
                    Audit ID: {auditSummaryId}
                  </div>
                  <div>
                    Report ID: <a href={`/report/?id=${reportId}`}>{reportId}</a>
                  </div>
                </div>
                <div class="column">
                  <div>
                    Score: {score} (Lighouse {auditProfile.lighthouseVersion})
                  </div>
                  <div>
                    Date: {dayjs(auditSummary.fetchTime).format('DD MMM YYYY, h:mm a')}
                  </div>
                  <div>
                    <button
                      class="button is-warning is-light is-small"
                      on:click={() => {
                        handleDeleteSummaryClicked();
                      }}>
                      Delete Audit
                    </button>
                    {#if showDeleteSummaryModal}
                      <DeleteSummaryModal auditSummaryId={auditSummaryId} on:close={handleDeleteSummaryDialogClosed} />
                    {/if}
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
