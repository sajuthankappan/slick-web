<script>
  import Chart from 'chart.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { mapTrend } from '../helpers/chart-helpers.js';

  export let data;
  let chartCanvas;
  const dispatch = createEventDispatcher();

  const chartData = mapTrend(data);

  onMount(async () => {
    const ctx = chartCanvas.getContext('2d');
    const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: chartData,

      // Configuration options go here
      options: {
        tooltips: {
          mode: 'index',
          callbacks: {
            footer: (tooltipItems, tooltipData) => {
              const currentIndex = tooltipItems[0].index;
              return data[currentIndex].fetchTime;
            },
          },
          footerFontStyle: 'normal',
        },
        scales: {
          yAxes: [{
            ticks: {
              max: 1,
              min: 0,
            },
          }],
        },
        elements: {
          point: {
            pointStyle: 'crossRot',
          },
        },
        onClick: (e, items) => {
          if (items.length > 0) {
            dispatch('chartclick', { index: items[0]._index });
          }
        },
      },
    });
  });
</script>

<canvas bind:this={chartCanvas}></canvas>
