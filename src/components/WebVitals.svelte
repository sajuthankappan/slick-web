<script>
  export let data;
</script>

<div class="columns is-multiline">
  <div class="column">
    <div class="field">
      <label class="label">FCP (First Contentful Paint)</label>
      <div class="control">
        {data.firstContentfulPaint.displayValue} (Score: {data.firstContentfulPaint.score})
      </div>
    </div>
    <div class="field">
      <label class="label">SI (Speed Index)</label>
      <div class="control">
        {data.speedIndex.displayValue} (Score: {data.speedIndex.score})
      </div>
    </div>
    <div class="field">
      <label class="label">LCP (Largest Contentful Paint)</label>
      <div class="control">
        {#if data.largestContentfulPaint}
          {data.largestContentfulPaint.displayValue} (Score: {data.largestContentfulPaint.score})
        {/if}
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">TTI (Time to Interactive)</label>
      <div class="control">
        {data.interactive.displayValue} (Score: {data.interactive.score})
      </div>
    </div>
    <div class="field">
      <label class="label">TBT (Total Blocking Time)</label>
      <div class="control">
        {data.totalBlockingTime.displayValue} (Score: {data.totalBlockingTime.score})
      </div>
    </div>
    <div class="field">
      <label class="label">CLS (Cumulative Layout Shift)</label>
      <div class="control">
        {#if data.cumulativeLayoutShift}
          {data.cumulativeLayoutShift.displayValue} (Score: {data.cumulativeLayoutShift.score})
        {/if}
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">FMP (First Meaningful Paint)</label>
      <div class="control">
        {data.firstMeaningfulPaint.displayValue} (Score: {data.firstMeaningfulPaint.score})
      </div>
    </div>
    <div class="field">
      <label class="label">FCI (First CPU Idle)</label>
      <div class="control">
        {data.firstCpuIdle.displayValue} (Score: {data.firstCpuIdle.score})
      </div>
    </div>
    <div class="field">
      <label class="label">FID (Max Potential First Input Delay)</label>
      <div class="control">
        {data.maxPotentialFid.displayValue} (Score: {data.maxPotentialFid.score})
      </div>
    </div>
  </div>
</div>
