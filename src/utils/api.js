import { camelCaseDeep, snakeCaseDeep } from 'utils/obj';
const GET = 'GET';
const POST = 'POST';
const PATCH = 'PATCH';
const PUT = 'PUT';
const DELETE = 'DELETE';

export const createApi = host => {
  return new ApiConfig(host);
};

class ApiConfig {
  constructor(host = '') {
    this.config = {
      host,
      // https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
      credentials: 'same-origin',
      // mode: '...' // https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
      csrfToken: null,
      auth: null,
    };
  }

  allowCrossOriginCookies() {
    this.config.credentials = 'include';
  }

  setCsrfToken(token) {
    this.config.csrfToken = token;
  }

  setAuth(auth) {
    this.config.auth = auth;
  }

  getHeaders(moreHeaders) {
    const headers = {};

    if (this.config.csrfToken) {
      headers['x-csrf-token'] = this.config.csrfToken;
    }

    if (this.config.auth) {
      headers.Authorization = this.config.auth;
    }

    return {
      ...headers,
      ...moreHeaders,
    };
  }

  getOptions(options) {
    const { headers: moreHeaders, ...moreOptions } = options;
    return {
      headers: this.getHeaders(moreHeaders),
      credentials: this.config.credentials,
      ...moreOptions,
    };
  }

  getPath(route) {
    return `${this.config.host}${route}`;
  }

  async get(route, options = {}) {
    return get(this.getPath(route), this.getOptions(options));
  }

  async post(route, body, options = {}) {
    return post(route, body, this.getOptions(options));
  }

  async patch(route, body, options = {}) {
    return patch(route, body, this.getOptions(options));
  }

  async put(route, body, options = {}) {
    return put(route, body, this.getOptions(options));
  }

  async del(route, options = {}) {
    return del(route, this.getOptions(options));
  }
}

const getHeaders = (body, moreHeaders) => {
  const defaultHeaders = {
    Accept: 'application/json',
  };

  if (body) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  return new Headers({ ...defaultHeaders, ...moreHeaders });
};

const getFullConfig = (method, options = {}) => {
  const { headers, body, rawBody, credentials } = options;
  const config = {
    method,
    headers: getHeaders(body, headers),
    credentials: credentials || 'same-origin',
  };

  if (body) {
    config.body = rawBody
      ? JSON.stringify(body)
      : JSON.stringify(snakeCaseDeep(body));
  }

  return config;
};

const apiRequest = async (route, conf) => {
  const response = await fetch(route, conf);
  if (response.ok) return apiResponse(response);
  throw apiError(response, route, conf.body);
};

const apiResponse = async response => {
  const contentType = response.headers.get('content-type');
  let results;
  if (contentType.includes('application/json')) {
    results = await response.json().then(camelCaseDeep);
  } else {
    results = await response.text();
  }
  return { results, response };
};

const apiError = (response, route, body = null) => {
  const err = new Error(
    `
    API request failed

    url:\t${route}
    status:\t${response.status}
    msg:\t${response.statusText}
    ${body ? `body: ${JSON.stringify(snakeCaseDeep(body))}` : ''}
    `
  );
  err.response = response;
  return err;
};

export const get = async (route, options = {}) => {
  const conf = getFullConfig(GET, options);
  return apiRequest(route, conf);
};

export const post = async (route, body, options = {}) => {
  const conf = getFullConfig(POST, { body, ...options });
  return apiRequest(route, conf);
};

export const patch = async (route, body, options = {}) => {
  const conf = getFullConfig(PATCH, { body, ...options });
  return apiRequest(route, conf);
};

export const put = async (route, body, options = {}) => {
  const conf = getFullConfig(PUT, { body, ...options });
  return apiRequest(route, conf);
};

export const del = async (route, options = {}) => {
  const conf = getFullConfig(DELETE, options);
  return apiRequest(route, conf);
};
