export function mapNetworkRequests(data) {
  let labels = [];
  let chartData = [];
  data.details.items.forEach((item, index) => {
    labels.push(index + 1);
    chartData.push([Math.round(item.startTime), Math.round(item.endTime)])
  });
  return {
    labels,
    datasets: [{
      label: 'Network',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: chartData
    }]
  };
}

export function mapTrend(data) {
  let labels = [];
  let chartData = [];
  data.forEach((summary, index) => {
    labels.push(summary.siteRunId);
    chartData.push(summary.categories.performance.score)
  });
  return {
    labels,
    datasets: [{
      label: 'Score',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: chartData,
      fill: false
    }]
  };
}
