<script>
  import { onMount } from 'svelte';
  import { currentUser } from '../stores';
  import { getReportSummary } from '../helpers/data/reports';
  import { getLighthouseCalculatorUrl } from '../helpers/lighthouse/calc';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';

  let reportId;
  let promise;

  async function retrieve() {
    const idToken = await $currentUser.getIdToken();
    const reportSummary = await getReportSummary(reportId, idToken);
    return reportSummary;
  }

  onMount(async () => {
    // promise = retrieve();
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
    <IdPickerLevel label="Report ID" on:retrieve={handleRetrieveClick} />

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
        <div class="columns is-multiline">
          <div class="column">
            <div class="field">
              <label class="label">FCP (First Contentful Paint)</label>
              <div class="control">
                {report.webVitals.firstContentfulPaint.displayValue} (Score: {report.webVitals.firstContentfulPaint.score})
              </div>
            </div>
            <div class="field">
              <label class="label">SI (Speed Index)</label>
              <div class="control">
                {report.webVitals.speedIndex.displayValue} (Score: {report.webVitals.speedIndex.score})
              </div>
            </div>
            <div class="field">
              <label class="label">LCP (Largest Contentful Paint)</label>
              <div class="control">
                {#if report.webVitals.largestContentfulPaint}
                  {report.webVitals.largestContentfulPaint.displayValue} (Score: {report.webVitals.largestContentfulPaint.score})
                {/if}
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">TTI (Time to Interactive)</label>
              <div class="control">
                {report.webVitals.interactive.displayValue} (Score: {report.webVitals.interactive.score})
              </div>
            </div>
            <div class="field">
              <label class="label">TBT (Total Blocking Time)</label>
              <div class="control">
                {report.webVitals.totalBlockingTime.displayValue} (Score: {report.webVitals.totalBlockingTime.score})
              </div>
            </div>
            <div class="field">
              <label class="label">CLS (Cumulative Layout Shift)</label>
              <div class="control">
                {#if report.webVitals.cumulativeLayoutShift}
                  {report.webVitals.cumulativeLayoutShift.displayValue} (Score: {report.webVitals.cumulativeLayoutShift.score})
                {/if}
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">FMP (First Meaningful Paint)</label>
              <div class="control">
                {report.webVitals.firstMeaningfulPaint.displayValue} (Score: {report.webVitals.firstMeaningfulPaint.score})
              </div>
            </div>
            <div class="field">
              <label class="label">FCI (First CPU Idle)</label>
              <div class="control">
                {report.webVitals.firstCpuIdle.displayValue} (Score: {report.webVitals.firstCpuIdle.score})
              </div>
            </div>
            <div class="field">
              <label class="label">FID (Max Potential First Input Delay)</label>
              <div class="control">
                {report.webVitals.maxPotentialFid.displayValue} (Score: {report.webVitals.maxPotentialFid.score})
              </div>
            </div>
          </div>
        </div>
      {/if}
    {:catch error}
      <HttpError error={error} />
    {/await}
  </section>
</div>
