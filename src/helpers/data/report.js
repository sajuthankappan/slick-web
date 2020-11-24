import sfetch from './slick-fetch';

const slickUrlPrefix = '/slick';
const slickQueueUrlPrefix = '/slick';

export async function getReports(idToken) {
  const url = `${slickUrlPrefix}/report`;
  const reports = await sfetch.get(url, idToken);
  return reports;
}

export async function getReport(reportId, idToken) {
  const url = `${slickUrlPrefix}/reports/${reportId}`;
  const report = await sfetch.get(url, idToken);
  return report;
}

export async function getTrend(siteId, pageId, auditProfileId, idToken) {
  const url = `${slickUrlPrefix}/trend/${siteId}/${pageId}/${auditProfileId}`;
  const trend = await sfetch.get(url, idToken);
  return trend;
}

export async function queueSite(siteParameters, idToken) {
  const url = `${slickQueueUrlPrefix}/queue-site`;
  const status = await sfetch.post(url, idToken, siteParameters);
  return status;
}

export async function deleteAuditSummary(auditSummaryId, idToken) {
  const url = `${slickUrlPrefix}/summaries/${auditSummaryId}`;
  await sfetch.del(url, idToken);
}
