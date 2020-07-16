<script>
  export let data;
</script>

<div class="columns is-multiline">
  <div class="column">
    <div class="field">
      <label class="label">FCP (First Contentful Paint)</label>
      <div class="control">
        {data.firstContentfulPaint.displayValue} (Score: {Math.round(data.firstContentfulPaint.score * 100)})
      </div>
    </div>
    <div class="field">
      <label class="label">SI (Speed Index)</label>
      <div class="control">
        {data.speedIndex.displayValue} (Score: {Math.round(data.speedIndex.score * 100)})
      </div>
    </div>
    <div class="field">
      <label class="label">LCP (Largest Contentful Paint)</label>
      <div class="control">
        {#if data.largestContentfulPaint}
          {data.largestContentfulPaint.displayValue} (Score: {Math.round(data.largestContentfulPaint.score * 100)})
        {/if}
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">TTI (Time to Interactive)</label>
      <div class="control">
        {data.interactive.displayValue} (Score: {Math.round(data.interactive.score * 100)})
      </div>
    </div>
    <div class="field">
      <label class="label">TBT (Total Blocking Time)</label>
      <div class="control">
        {data.totalBlockingTime.displayValue} (Score: {Math.round(data.totalBlockingTime.score * 100)})
      </div>
    </div>
    <div class="field">
      <label class="label">CLS (Cumulative Layout Shift)</label>
      <div class="control">
        {#if data.cumulativeLayoutShift}
          {data.cumulativeLayoutShift.displayValue} (Score: {Math.round(data.cumulativeLayoutShift.score * 100)})
        {/if}
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">FMP (First Meaningful Paint)</label>
      <div class="control">
        {data.firstMeaningfulPaint.displayValue} (Score: {Math.round(data.firstMeaningfulPaint.score * 100)})
      </div>
    </div>
    <div class="field">
      <label class="label">FCI (First CPU Idle)</label>
      <div class="control">
        {data.firstCpuIdle.displayValue} (Score: {Math.round(data.firstCpuIdle.score * 100)})
      </div>
    </div>
    <div class="field">
      <label class="label">FID (Max Potential First Input Delay)</label>
      <div class="control">
        {data.maxPotentialFid.displayValue} (Score: {Math.round(data.maxPotentialFid.score * 100)})
      </div>
    </div>
  </div>
</div>
