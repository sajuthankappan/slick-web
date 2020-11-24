let config;

function FetchException(code, message) {
  this.code = code;
  this.message = message;
}
FetchException.prototype = new Error();

async function ensureResponseOk(res) {
  if (res.ok) {
    return res;
  }

  const bodyText = await res.text();
  throw new FetchException(res.status, bodyText);
}

function getHeaders(token, data = null) {
  const headers = {};

  if (data) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function slickFetch(url, token, method = 'GET', data = null) {
  const { baseUrl } = config;
  const apiUrl = `${baseUrl}${url}`;
  let apiOptions;
  const headers = getHeaders(token, data);

  if (data) {
    const body = data && JSON.stringify(data);
    apiOptions = {
      method,
      headers,
      body,
    };
  } else {
    apiOptions = {
      method,
      headers,
    };
  }

  const res = await fetch(apiUrl, apiOptions);
  return ensureResponseOk(res);
}

async function getResponseData(response) {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.indexOf('application/json') !== -1) {
    const responseData = await response.json();
    return responseData;
  }

  const responseData = await response.text();
  return responseData;
}

async function get(url, token = null, data = null) {
  const response = await slickFetch(url, token, 'GET', data);
  return getResponseData(response);
}

async function post(url, token = null, data = null) {
  const response = await slickFetch(url, token, 'POST', data);
  return getResponseData(response);
}

async function put(url, token = null, data = null) {
  const response = await slickFetch(url, token, 'PUT', data);
  return getResponseData(response);
}

async function del(url, token = null, data = null) {
  const response = await slickFetch(url, token, 'DELETE', data);
  return getResponseData(response);
}

function init(initConfig) {
  config = initConfig;
}

const sfetch = {
  get,
  post,
  put,
  del,
  init,
};

export default sfetch;
