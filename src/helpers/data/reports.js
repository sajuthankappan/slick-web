import sfetch from './slick-fetch';

export async function getReports(idToken) {
  const url = '/reports';
  const reports = await sfetch.get(url, idToken);
  return reports;
}

export async function getReport(reportId, idToken) {
  const url = `/reports/${reportId}`;
  const report = await sfetch.get(url, idToken);
  return report;
}

export async function getSite(siteId, idToken) {
  const url = `/sites/${siteId}`;
  const report = await sfetch.get(url, idToken);
  return report;
}

export async function getTread(treadId, idToken) {
  const url = `/treads/${treadId}`;
  const report = await sfetch.get(url, idToken);
  return report;
}

export async function getSiteTreads(siteId, idToken) {
  const url = `/site-treads/${siteId}`;
  const report = await sfetch.get(url, idToken);
  return report;
}

export async function getTrend(siteId, pageId, auditProfileId, idToken) {
  const url = `/trend/${siteId}/${pageId}/${auditProfileId}`;
  const report = await sfetch.get(url, idToken);
  return report;
}
