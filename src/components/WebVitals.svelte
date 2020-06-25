<script>
  export let webVitals;
</script>

<div class="columns is-multiline">
  <div class="column">
    <div class="field">
      <label class="label">FCP (First Contentful Paint)</label>
      <div class="control">
        {webVitals.firstContentfulPaint.displayValue} (Score: {webVitals.firstContentfulPaint.score})
      </div>
    </div>
    <div class="field">
      <label class="label">SI (Speed Index)</label>
      <div class="control">
        {webVitals.speedIndex.displayValue} (Score: {webVitals.speedIndex.score})
      </div>
    </div>
    <div class="field">
      <label class="label">LCP (Largest Contentful Paint)</label>
      <div class="control">
        {#if webVitals.largestContentfulPaint}
          {webVitals.largestContentfulPaint.displayValue} (Score: {webVitals.largestContentfulPaint.score})
        {/if}
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">TTI (Time to Interactive)</label>
      <div class="control">
        {webVitals.interactive.displayValue} (Score: {webVitals.interactive.score})
      </div>
    </div>
    <div class="field">
      <label class="label">TBT (Total Blocking Time)</label>
      <div class="control">
        {webVitals.totalBlockingTime.displayValue} (Score: {webVitals.totalBlockingTime.score})
      </div>
    </div>
    <div class="field">
      <label class="label">CLS (Cumulative Layout Shift)</label>
      <div class="control">
        {#if webVitals.cumulativeLayoutShift}
          {webVitals.cumulativeLayoutShift.displayValue} (Score: {webVitals.cumulativeLayoutShift.score})
        {/if}
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">FMP (First Meaningful Paint)</label>
      <div class="control">
        {webVitals.firstMeaningfulPaint.displayValue} (Score: {webVitals.firstMeaningfulPaint.score})
      </div>
    </div>
    <div class="field">
      <label class="label">FCI (First CPU Idle)</label>
      <div class="control">
        {webVitals.firstCpuIdle.displayValue} (Score: {webVitals.firstCpuIdle.score})
      </div>
    </div>
    <div class="field">
      <label class="label">FID (Max Potential First Input Delay)</label>
      <div class="control">
        {webVitals.maxPotentialFid.displayValue} (Score: {webVitals.maxPotentialFid.score})
      </div>
    </div>
  </div>
</div>
