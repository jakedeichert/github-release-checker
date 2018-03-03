import { camelCaseDeep } from 'utils/obj';

/**
 * Let initial app data from server override reducer defaults.
 *
 * This is only useful when the html file is rendered on the server
 * to preload the state with data.
 *
 * See `/static/html/index.html` for example data.
 */
export default () => {
  return {};
};
