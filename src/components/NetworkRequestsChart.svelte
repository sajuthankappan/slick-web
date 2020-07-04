<script>
  import Chart from 'chart.js';
  import { onMount } from 'svelte';
  import { mapNetworkRequests } from '../helpers/chart-helpers.js';

  export let data;
  let chartCanvas;

  let chartData = mapNetworkRequests(data);

  onMount(async () => {
    const ctx = chartCanvas.getContext('2d');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',

        // The data for our dataset
        data: chartData,

        // Configuration options go here
        options: {
        tooltips: {
          mode: 'index',
          callbacks: {
            footer: function(tooltipItems, tooltipData) {
              let currentIndex = tooltipItems[0].index;
              return data.details.items[currentIndex].url;
            }
          },
          footerFontStyle: 'normal'
        },
      }
    });
  });
</script>

<canvas bind:this={chartCanvas}></canvas>
