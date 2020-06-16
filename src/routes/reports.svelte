<script>
  import { onMount } from 'svelte';
  import { currentUser } from '../stores';
  import { getReportSummary } from '../helpers/data/reports';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import YearMonthPickerLevel from '../components/ReportIdPickerLevel.svelte';

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
    reportId = e.detail.reportId;
    promise = retrieve();
  }

  function getLighthouseCalculatorUrl(report) {
    const measures = report.keyAuditMeasures;
    if (report.lighthouseVersion.startsWith('6')) {
      return `https://googlechrome.github.io/lighthouse/scorecalc/#FCP=${measures.firstContentfulPaint.numericValue}&SI=${measures.speedIndex.numericValue}&LCP=${measures.largestContentfulPaint.numericValue}&TTI=${measures.interactive.numericValue}&TBT=${measures.totalBlockingTime.numericValue}&CLS=${measures.cumulativeLayoutShift.numericValue}&FCI=${measures.firstCpuIdle.numericValue}&FMP=${measures.firstMeaningfulPaint.numericValue}&FCI=${measures.firstCpuIdle.numericValue}&device=${report.configSettings.emulatedFormFactor}&version=6`;
      //return `https://googlechrome.github.io/lighthouse/scorecalc/#first-contentful-paint=${measures.firstContentfulPaint.numericValue}&speed-index=${measures.speedIndex.numericValue}&largest-contentful-paint=${measures.largestContentfulPaint.numericValue}&interactive=${measures.interactive.numericValue}&total-blocking-time=${measures.totalBlockingTime.numericValue}&cumulative-layout-shift=${measures.cumulativeLayoutShift.numericValue}&first-cpu-idle=${measures.firstCpuIdle.numericValue}&first-meaningful-paint=${measures.firstMeaningfulPaint.numericValue}&device=${report.configSettings.emulatedFormFactor}&version=6.0.0`;
    }
  
    return `https://googlechrome.github.io/lighthouse/scorecalc/#FCP=${measures.firstContentfulPaint.numericValue}&FMP=${measures.firstMeaningfulPaint.numericValue}&SI=${measures.speedIndex.numericValue}&TTI=${measures.interactive.numericValue}&FCI=${measures.firstCpuIdle.numericValue}&max-potential-fid=${measures.maxPotentialFid.numericValue}&FCI=${measures.firstCpuIdle.numericValue}&FMP=${measures.firstMeaningfulPaint.numericValue}&device=${report.configSettings.emulatedFormFactor}&version=5`;
    // return `https://googlechrome.github.io/lighthouse/scorecalc/#first-contentful-paint=${measures.firstContentfulPaint.numericValue}&first-meaningful-paint=${measures.firstMeaningfulPaint.numericValue}&speed-index=${measures.speedIndex.numericValue}&interactive=${measures.interactive.numericValue}&first-cpu-idle=${measures.firstCpuIdle.numericValue}&max-potential-fid=${measures.maxPotentialFid.numericValue}&first-cpu-idle=${measures.firstCpuIdle.numericValue}&first-meaningful-paint=${measures.firstMeaningfulPaint.numericValue}&device=${report.configSettings.emulatedFormFactor}&version=5.6.0`;
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
    <YearMonthPickerLevel pickerType="month" on:retrieve={handleRetrieveClick} />

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
                {report.keyAuditMeasures.firstContentfulPaint.displayValue}
              </div>
            </div>
            <div class="field">
              <label class="label">SI (Speed Index)</label>
              <div class="control">
                {report.keyAuditMeasures.speedIndex.displayValue}
              </div>
            </div>
            <div class="field">
              <label class="label">LCP (Largest Contentful Paint)</label>
              <div class="control">
                {report.keyAuditMeasures.largestContentfulPaint
                  && report.keyAuditMeasures.largestContentfulPaint.displayValue}
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">TTI (Time to Interactive)</label>
              <div class="control">
                {report.keyAuditMeasures.interactive.displayValue}
              </div>
            </div>
            <div class="field">
              <label class="label">TBT (Total Blocking Time)</label>
              <div class="control">
                {report.keyAuditMeasures.totalBlockingTime.displayValue}
              </div>
            </div>
            <div class="field">
              <label class="label">CLS (Cumulative Layout Shift)</label>
              <div class="control">
                {report.keyAuditMeasures.cumulativeLayoutShift
                && report.keyAuditMeasures.cumulativeLayoutShift.displayValue}
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">FMP (First Meaningful Paint)</label>
              <div class="control">
                {report.keyAuditMeasures.firstMeaningfulPaint.displayValue}
              </div>
            </div>
            <div class="field">
              <label class="label">FCI (First CPU Idle)</label>
              <div class="control">
                {report.keyAuditMeasures.firstCpuIdle.displayValue}
              </div>
            </div>
            <div class="field">
              <label class="label">FID (Max Potential First Input Delay)</label>
              <div class="control">
                {report.keyAuditMeasures.maxPotentialFid.displayValue}
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
