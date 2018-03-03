import { camelCaseDeep, snakeCaseDeep } from 'utils/obj';
const GET = 'get';
const POST = 'post';
const PATCH = 'patch';
const DELETE = 'delete';

const fetchConfig = (methodType, options = {}) => {
  const { headers, body, rawBody, credentials } = options;
  const config = {
    // POST, PATCH, DELETE all use the 'post' method
    method: methodType === GET ? GET : POST,
    credentials: credentials || 'same-origin',
  };
  config.headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  });

  if (body) {
    config.body = rawBody
      ? JSON.stringify(body)
      : JSON.stringify(snakeCaseDeep(body));
  }
  if (methodType === PATCH || methodType === DELETE) {
    config.headers.set('X-HTTP-Method-Override', methodType);
  }
  return config;
};

const apiResponse = async response => {
  const results = await response.json().then(camelCaseDeep);
  const status = {
    code: response.status,
    msg: response.statusText,
  };
  return [results, status, response.headers];
};

const apiError = (response, route, body = null) => {
  const error = new Error(
    `
    API request failed.
    url: ${route}
    ${body ? `Body: ${JSON.stringify(snakeCaseDeep(body))}` : ''}
    `
  );
  error.response = response;
  return error;
};

export const get = async (route, options = {}) => {
  const conf = fetchConfig(GET, options);
  const response = await fetch(route, conf);
  if (response.ok) return apiResponse(response);
  throw apiError(response, route);
};

export const post = async (route, body, options = {}) => {
  const conf = fetchConfig(POST, { body, ...options });
  const response = await fetch(route, conf);
  if (response.ok) return apiResponse(response);
  throw apiError(response, route, body);
};

export const patch = async (route, body, options = {}) => {
  const conf = fetchConfig(PATCH, { body, ...options });
  const response = await fetch(route, conf);
  if (response.ok) return apiResponse(response);
  throw apiError(response, route, body);
};

export const del = async (route, body, options = {}) => {
  const conf = fetchConfig(DELETE, { body, ...options });
  const response = await fetch(route, conf);
  if (response.ok) return apiResponse(response);
  throw apiError(response, route, body);
};
