export function mapNetworkRequests(data) {
  const { networkRequests } = data;
  const labels = [];
  const networkData = [];
  let count = 0;

  networkRequests.details.items.forEach((item) => {
    count += 1;
    labels.push(count);
    networkData.push([Math.round(item.startTime), Math.round(item.endTime)]);
  });

  return {
    labels,
    datasets: [{
      label: 'Network',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: networkData,
    }],
  };
}

export function mapTrend(data) {
  const labels = [];
  const chartData = [];
  data.forEach((summary) => {
    labels.push(summary.siteRunId);
    chartData.push(Math.round(summary.categories.performance.score * 100));
  });
  return {
    labels,
    datasets: [{
      label: 'Score',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: chartData,
      fill: false,
      pointRadius: 10,
      pointHoverRadius: 15,
    }],
  };
}


export function mapScoreWebVitalsTrend(data) {
  const labels = [];
  const scoreData = [];
  const fcpData = [];
  const speedIndexData = [];
  const largestContentfulPaintData = [];
  const interactivepDatainteractivepData = [];
  const totalBlockingTimeData = [];
  const cumulativeLayoutShiftData = [];

  data.forEach((summary) => {
    labels.push(summary.siteRunId);
    scoreData.push(Math.round(summary.categories.performance.score * 100));
    fcpData.push(Math.round(summary.webVitals.firstContentfulPaint.score * 100))
    speedIndexData.push(Math.round(summary.webVitals.speedIndex.score * 100))
    largestContentfulPaintData.push(Math.round(summary.webVitals.largestContentfulPaint.score * 100))
    interactivepDatainteractivepData.push(Math.round(summary.webVitals.interactive.score * 100))
    totalBlockingTimeData.push(Math.round(summary.webVitals.totalBlockingTime.score * 100))
    cumulativeLayoutShiftData.push(Math.round(summary.webVitals.cumulativeLayoutShift.score * 100))
  });

  return {
    labels,
    datasets: [
      {
        label: 'FCP',
        type: 'line',
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: fcpData,
        fill: false,
      }, {
        label: 'SI',
        type: 'line',
        backgroundColor: 'green',
        borderColor: 'green',
        data: speedIndexData,
        fill: false,
      }, {
        label: 'LCP',
        type: 'line',
        backgroundColor: 'brown',
        borderColor: 'brown',
        data: largestContentfulPaintData,
        fill: false,
      }, {
        label: 'TTI',
        type: 'line',
        backgroundColor: 'darkcyan',
        borderColor: 'darkcyan',
        data: interactivepDatainteractivepData,
        fill: false,
      }, {
        label: 'TBT',
        type: 'line',
        backgroundColor: 'indigo',
        borderColor: 'indigo',
        data: totalBlockingTimeData,
        fill: false,
      }, {
        label: 'CLS',
        type: 'line',
        backgroundColor: 'olive',
        borderColor: 'olive',
        data: cumulativeLayoutShiftData,
        fill: false,
      }, {
        label: 'Score',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: scoreData,
        fill: false,
      }, 
    ],
  };
}
