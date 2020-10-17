<script>
  export let data;
</script>

<div class="columns is-multiline">
  <div class="column">
    <div class="field">
      <div class="label">FCP (First Contentful Paint)</div>
      <div class="control">
        {data.firstContentfulPaint.displayValue} (Score: {Math.round(data.firstContentfulPaint.score * 100)})
      </div>
    </div>
    <div class="field">
      <div class="label">SI (Speed Index)</div>
      <div class="control">
        {data.speedIndex.displayValue} (Score: {Math.round(data.speedIndex.score * 100)})
      </div>
    </div>
    <div class="field">
      <div class="label">LCP (Largest Contentful Paint)</div>
      <div class="control">
        {#if data.largestContentfulPaint}
          {data.largestContentfulPaint.displayValue} (Score: {Math.round(data.largestContentfulPaint.score * 100)})
        {/if}
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <div class="label">TTI (Time to Interactive)</div>
      <div class="control">
        {data.interactive.displayValue} (Score: {Math.round(data.interactive.score * 100)})
      </div>
    </div>
    <div class="field">
      <div class="label">TBT (Total Blocking Time)</div>
      <div class="control">
        {data.totalBlockingTime.displayValue} (Score: {Math.round(data.totalBlockingTime.score * 100)})
      </div>
    </div>
    <div class="field">
      <div class="label">CLS (Cumulative Layout Shift)</div>
      <div class="control">
        {#if data.cumulativeLayoutShift}
          {data.cumulativeLayoutShift.displayValue} (Score: {Math.round(data.cumulativeLayoutShift.score * 100)})
        {/if}
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <div class="label">FMP (First Meaningful Paint)</div>
      <div class="control">
        {data.firstMeaningfulPaint.displayValue} (Score: {Math.round(data.firstMeaningfulPaint.score * 100)})
      </div>
    </div>
    <div class="field">
      <div class="label">FCI (First CPU Idle)</div>
      <div class="control">
        {data.firstCpuIdle.displayValue} (Score: {Math.round(data.firstCpuIdle.score * 100)})
      </div>
    </div>
    <div class="field">
      <div class="label">FID (Max Potential First Input Delay)</div>
      <div class="control">
        {data.maxPotentialFid.displayValue} (Score: {Math.round(data.maxPotentialFid.score * 100)})
      </div>
    </div>
  </div>
</div>
