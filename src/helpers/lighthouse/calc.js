// eslint-disable-next-line import/prefer-default-export
export function getLighthouseCalculatorUrl(report) {
  const measures = report.webVitals;
  if (report.lighthouseVersion.startsWith('5')) {
    return `https://googlechrome.github.io/lighthouse/scorecalc/#FCP=${measures.firstContentfulPaint.numericValue}&FMP=${measures.firstMeaningfulPaint.numericValue}&SI=${measures.speedIndex.numericValue}&TTI=${measures.interactive.numericValue}&max-potential-fid=${measures.maxPotentialFid.numericValue}&FCI=${measures.firstCpuIdle?.numericValue}&FMP=${measures.firstMeaningfulPaint.numericValue}&device=${report.configSettings.emulatedFormFactor}&version=5`;
  }

  return `https://googlechrome.github.io/lighthouse/scorecalc/#FCP=${measures.firstContentfulPaint.numericValue}&SI=${measures.speedIndex.numericValue}&LCP=${measures.largestContentfulPaint.numericValue}&TTI=${measures.interactive.numericValue}&TBT=${measures.totalBlockingTime.numericValue}&CLS=${measures.cumulativeLayoutShift.numericValue}&FCI=${measures.firstCpuIdle?.numericValue}&FMP=${measures.firstMeaningfulPaint.numericValue}&device=${report.configSettings.emulatedFormFactor}`;
}
