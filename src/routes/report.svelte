<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { currentUser } from '../stores';
  import { getReportSummary } from '../helpers/data/reports';
  import { getLighthouseCalculatorUrl } from '../helpers/lighthouse/calc';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';
  import WebVitals from '../components/WebVitals.svelte';

  let reportId;
  let promise;

  const { page } = stores();
  const { query } = $page;

  async function retrieve() {
    if ($currentUser) {
      const idToken = await $currentUser.getIdToken();
      const reportSummary = await getReportSummary(reportId, idToken);
      return reportSummary;
    } else {
      const reportSummary = await getReportSummary(reportId);
      return reportSummary;
    }
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
  <title>Report</title>
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
        <div class="field box has-text-centered">
          <div>Lighthouse Version: {report.lighthouseVersion}</div>
          <div><a href={report.requestedUrl}>{report.requestedUrl}</a></div>
          <div>Report Time: {report.fetchTime}</div>
          <label class="label">Score ({report.configSettings.emulatedFormFactor})</label>
          <div class="control has-text-centered">
            <a href={getLighthouseCalculatorUrl(report)}>{report.categories.performance.score}</a>
          </div>
        </div>
        <WebVitals webVitals={report.webVitals} />
      {/if}
    {:catch error}
      <HttpError error={error} />
    {/await}
  </section>
</div>
