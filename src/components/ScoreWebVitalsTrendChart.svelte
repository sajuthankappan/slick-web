<script>
  import dayjs from 'dayjs';
  import Chart from 'chart.js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { mapScoreWebVitalsTrend } from '../helpers/chart-helpers.js';

  export let data;
  let chartCanvas;
  const dispatch = createEventDispatcher();

  const chartData = mapScoreWebVitalsTrend(data);

  onMount(async () => {
    const ctx = chartCanvas.getContext('2d');
    const chart = new Chart(ctx, {
      // The type of chart we want to create
      //type: 'line',
      type: 'bar',

      // The data for our dataset
      data: chartData,

      // Configuration options go here
      options: {
        tooltips: {
          mode: 'index',
          callbacks: {
            footer: (tooltipItems, tooltipData) => {
              const currentIndex = tooltipItems[0].index;
              return dayjs(data[currentIndex].fetchTime).format('DD MMM YYYY, h:mm a');
            },
          },
          footerFontStyle: 'normal',
        },
        scales: {
          yAxes: [{
            ticks: {
              max: 100,
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
