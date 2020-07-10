<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { currentUser } from '../stores';
  import { getReport } from '../helpers/data/reports';
  import { getLighthouseCalculatorUrl } from '../helpers/lighthouse/calc';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';
  import WebVitals from '../components/WebVitals.svelte';
  import LargestContentfulPaintElement from '../components/largestContentfulPaintElement.svelte';
  import NetworkRequests from '../components/NetworkRequests.svelte';
  import NetworkRequestsChart from '../components/NetworkRequestsChart.svelte';
  import ThirdPartySummary from '../components/ThirdPartySummary.svelte';

  let reportId;
  let promise;
  let currentTab = 'general';

  const { page } = stores();
  const { query } = $page;

  async function retrieve() {
    if ($currentUser) {
      const idToken = await $currentUser.getIdToken();
      const report = await getReport(reportId, idToken);
      return report;
    }
  
    const report = await getReport(reportId);
    return report;
  }

  onMount(async () => {
    if (query && query.id) {
      reportId = query.id;
      promise = retrieve();
    }
  });

  async function handleRetrieveClick(e) {
    e.preventDefault();
    reportId = e.detail.id;
    promise = retrieve();
  }
</script>

<svelte:head>
  <title>Report | Slick</title>
</svelte:head>

<div class="container">
  <div class="box">
    <h1 class="title has-text-centered">Report</h1>
  </div>

  <section class="section">
    <IdPickerLevel label="Report ID" 
      id={reportId} 
      on:retrieve={handleRetrieveClick}
    />

    {#await promise}
      <Loading />
    {:then report}
      {#if report}
        <div class="box has-text-centered">
          <div><a href={report.requestedUrl}>{report.requestedUrl}</a></div>
          <div>Report Time: {report.fetchTime}</div>
          <label class="label">Score (Lighthouse {report.lighthouseVersion} {report.configSettings.emulatedFormFactor}) </label>
          <div class="control has-text-centered">
            <a href={getLighthouseCalculatorUrl(report)}>{report.categories.performance.score}</a>
          </div>
        </div>
        <WebVitals data={report.webVitals} />
        {#if report.networkRequests}
          <div class="tabs">
            <ul>
              <li class:is-active={currentTab === 'general'} on:click={() => { currentTab = 'general'; }}><a>General</a></li>
              <li class:is-active={currentTab === 'network'} on:click={() => { currentTab = 'network'; }}><a>Network</a></li>
              <li class:is-active={currentTab === 'others'} on:click={() => { currentTab = 'others'; }}><a>Others</a></li>
            </ul>
          </div>
          {#if report.networkRequests}
            {#if currentTab === 'general'}
              {#if report.screenshotThumbnails}
                {#each report.screenshotThumbnails.details.items as item}
                  <img class="px-1" src={item.data} alt="filmstrip thumbnail"/>
                {/each}
              {/if}
              {#if report.largestContentfulPaintElement}
                <section class="section">
                  <h2 class="title is-5">Largest Contentful Paint Element</h2>
                  <LargestContentfulPaintElement data={report.largestContentfulPaintElement} />
                </section>
              {/if}
              {#if report.thirdPartySummary}
                <div class="section">
                  <h2 class="title is-5">Third Party Summary</h2>
                  <div>{report.thirdPartySummary.displayValue}</div>
                  <ThirdPartySummary data={report.thirdPartySummary} />
                </div>
              {/if}
            {:else if currentTab === 'network'}
              <div class="has-text-weight-bold">Network Chart</div>
              <NetworkRequestsChart data={report.networkRequests} />
              <div class="has-text-weight-bold">Network Requests</div>
              <NetworkRequests data={report.networkRequests} />
            {:else if currentTab === 'others'}
              {#if report.screenshotThumbnails}
                {#each report.screenshotThumbnails.details.items as item}
                  <img class="px-1" src={item.data} alt="filmstrip thumbnail"/>
                {/each}
              {/if}
            {/if}
          {/if}
        {/if}
      {/if}
    {:catch error}
      <HttpError error={error} />
    {/await}
  </section>
</div>
