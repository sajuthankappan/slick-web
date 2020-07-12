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
    chartData.push(summary.categories.performance.score);
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
