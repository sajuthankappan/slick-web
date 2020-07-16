<script>
  import moment from 'moment';
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import marked from 'marked';
  import { currentUser } from '../stores';
  import { getReport } from '../helpers/data/reports';
  import { getLighthouseCalculatorUrl } from '../helpers/lighthouse/calc';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';
  import WebVitals from '../components/WebVitals.svelte';
  import LargestContentfulPaintElement from '../components/LargestContentfulPaintElement.svelte';
  import AuditTable from '../components/AuditTable.svelte';
  import PreconnectWarnings from '../components/PreconnectWarnings.svelte';
  import AuditOpportunity from '../components/AuditOpportunity.svelte';
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
          <div>Date: {moment(report.fetchTime).calendar()}</div>
          <div>Score: {Math.round(report.categories.performance.score * 100)} (Lighthouse {report.lighthouseVersion} {report.configSettings.emulatedFormFactor})</div>
          <div><a href={getLighthouseCalculatorUrl(report)}>Lighthouse Scoring Calculator</a></div>
        </div>
        <WebVitals data={report.webVitals} />
        {#if report.networkRequests}
          <div class="tabs">
            <ul>
              <li class:is-active={currentTab === 'general'} on:click={() => { currentTab = 'general'; }}><a>General</a></li>
              <li class:is-active={currentTab === 'requests'} on:click={() => { currentTab = 'requests'; }}><a>Requests</a></li>
              <li class:is-active={currentTab === 'network'} on:click={() => { currentTab = 'network'; }}><a>Network</a></li>
              <li class:is-active={currentTab === 'images'} on:click={() => { currentTab = 'images'; }}><a>Images</a></li>
              <li class:is-active={currentTab === 'scripts'} on:click={() => { currentTab = 'scripts'; }}><a>Scripts</a></li>
              <li class:is-active={currentTab === 'styles'} on:click={() => { currentTab = 'styles'; }}><a>Styles</a></li>
            </ul>
          </div>
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
            {#if report.renderBlockingResources && report.renderBlockingResources.details}
              <section class="section">
                <h2 class="title is-5">{report.renderBlockingResources.title}</h2>
                <div class="content is-size-7">{@html marked(report.renderBlockingResources.description)}</div>
                <AuditOpportunity data={report.renderBlockingResources.details} />
              </section>
            {/if}
            {#if report.thirdPartySummary}
              <div class="section">
                <h2 class="title is-5">Third Party Summary</h2>
                <div>{report.thirdPartySummary.displayValue}</div>
                <ThirdPartySummary data={report.thirdPartySummary} />
              </div>
            {/if}
            {#if report.resourceSummary}
              <section class="section">
                <h2 class="title is-5">Resoure Summary</h2>
                <div class="content is-size-7">{report.resourceSummary.title}</div>
                <AuditTable data={report.resourceSummary.details} />
              </section>
            {/if}
          {:else if currentTab === 'requests'}
            {#if report.networkRequests}
              <h2 class="title is-5">Chart</h2>
              <NetworkRequestsChart data={{networkRequests: report.networkRequests, mainThreadTasks: report.mainThreadTasks}} />
              <h2 class="title is-5">Network Requests</h2>
              <NetworkRequests data={report.networkRequests} />
            {/if}
          {:else if currentTab === 'network'}
            {#if report.usesHttp2}
              <section class="section">
                <h2 class="title is-5">{report.usesHttp2.title}</h2>
                <AuditTable data={report.usesHttp2.details} />
              </section>
            {/if}
            {#if report.usesLongCacheTtl}
              <section class="section">
                <h2 class="title is-5">{report.usesLongCacheTtl.title}</h2>
                <AuditTable data={report.usesLongCacheTtl.details} />
              </section>
            {/if}
            {#if report.usesRelPreconnect}
              <section class="section">
                <h2 class="title is-5">{report.usesRelPreconnect.title}</h2>
                <PreconnectWarnings data={report.usesRelPreconnect.warnings} />
              </section>
            {/if}
          {:else if currentTab === 'images'}
            {#if report.usesResponsiveImages && report.usesResponsiveImages.details}
              <section class="section">
                <h2 class="title is-5">{report.usesResponsiveImages.title}</h2>
                <div class="content is-size-7">{@html marked(report.usesResponsiveImages.description)}</div>
                <AuditOpportunity data={report.usesResponsiveImages.details} />
              </section>
            {/if}
            {#if report.usesOptimizedImages && report.usesOptimizedImages.details}
              <section class="section">
                <h2 class="title is-5">{report.usesOptimizedImages.title}</h2>
                <div class="content is-size-7">{@html marked(report.usesOptimizedImages.description)}</div>
                <AuditOpportunity data={report.usesOptimizedImages.details} />
              </section>
            {/if}
            {#if report.usesWebpImages && report.usesWebpImages.details}
              <section class="section">
                <h2 class="title is-5">{report.usesWebpImages.title}</h2>
                <div class="content is-size-7">{@html marked(report.usesWebpImages.description)}</div>
                <AuditOpportunity data={report.usesWebpImages.details} />
              </section>
            {/if}
            {#if report.offscreenImages && report.offscreenImages.details}
              <section class="section">
                <h2 class="title is-5">{report.offscreenImages.title}</h2>
                <div class="content is-size-7">{@html marked(report.offscreenImages.description)}</div>
                <AuditOpportunity data={report.offscreenImages.details} />
              </section>
            {/if}
          {:else if currentTab === 'scripts'}
            {#if report.mainThreadWorkBreakdown && report.mainThreadWorkBreakdown.details}
              <section class="section">
                <h2 class="title is-5">Main Thread Tasks</h2>
                <AuditTable data={report.mainThreadWorkBreakdown.details} />
              </section>
            {/if}
            {#if report.bootupTime && report.bootupTime.details}
              <section class="section">
                <h2 class="title is-5">{report.bootupTime.title}</h2>
                <AuditTable data={report.bootupTime.details} />
              </section>
            {/if}
            {#if report.unminifiedJavascript && report.unminifiedJavascript.details}
              <section class="section">
                <h2 class="title is-5">{report.unminifiedJavascript.title}</h2>
                <div class="content is-size-7">{@html marked(report.unminifiedJavascript.description)}</div>
                <AuditOpportunity data={report.unminifiedJavascript.details} />
              </section>
            {/if}
            {#if report.unusedJavascript && report.unusedJavascript.details}
              <section class="section">
                <h2 class="title is-5">{report.unusedJavascript.title}</h2>
                <div class="content is-size-7">{@html marked(report.unusedJavascript.description)}</div>
                <AuditOpportunity data={report.unusedJavascript.details} />
              </section>
            {/if}
            {#if report.mainThreadTasks && report.mainThreadTasks.details}
              <section class="section">
                <h2 class="title is-5">{report.mainThreadWorkBreakdown.title}</h2>
                <AuditTable data={report.mainThreadTasks.details} />
              </section>
            {/if}
          {:else if currentTab === 'styles'}
            {#if report.unminifiedCss && report.unminifiedCss.details}
              <section class="section">
                <h2 class="title is-5">{report.unminifiedCss.title}</h2>
                <div class="content is-size-7">{@html marked(report.unminifiedCss.description)}</div>
                <AuditOpportunity data={report.unminifiedCss.details} />
              </section>
            {/if}
            {#if report.unusedCssRules && report.unusedCssRules.details}
              <section class="section">
                <h2 class="title is-5">{report.unusedCssRules.title}</h2>
                <div class="content is-size-7">{@html marked(report.unusedCssRules.description)}</div>
                <AuditOpportunity data={report.unusedCssRules.details} />
              </section>
            {/if}
          {/if}
        {/if}
      {/if}
    {:catch error}
      <HttpError error={error} />
    {/await}
  </section>
</div>
