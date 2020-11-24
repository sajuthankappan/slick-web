import sfetch from './slick-fetch';

const slickUrlPrefix = '/slick';

export async function getSite(siteId, idToken) {
  const url = `${slickUrlPrefix}/sites/${siteId}`;
  const site = await sfetch.get(url, idToken);
  return site;
}

export async function getGroupSites(groupId, idToken) {
  const url = `${slickUrlPrefix}/group-sites/${groupId}`;
  const sites = await sfetch.get(url, idToken);
  return sites;
}

export async function addSite(site, idToken) {
  const url = `${slickUrlPrefix}/sites`;
  const status = await sfetch.post(url, idToken, site);
  return status;
}

export async function updateSite(site, idToken) {
  const url = `${slickUrlPrefix}/sites`;
  const status = await sfetch.put(url, idToken, site);
  return status;
}
