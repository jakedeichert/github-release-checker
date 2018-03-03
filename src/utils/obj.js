import { camelToSnake, snakeToCamel } from './string';

export const isIterable = o =>
  o !== null && typeof o[Symbol.iterator] === 'function';

/**
 * Pick properties from an object.
 * @param   {Object}    o         The original object.
 * @param   {string[]}  props     The props to pick from the object.
 * @returns {Object}              An object literal with only the specified properties.
 */
export const pick = (o, ...props) => {
  return props.reduce((a, x) => {
    if (o.hasOwnProperty(x)) a[x] = o[x];
    return a;
  }, {});
};

/**
 * Pick valid properties from an object. Null and undefined values are excluded.
 * @param   {Object}    o         The original object.
 * @param   {string[]}  props     The props to pick from the object.
 * @returns {Object}              An object literal with only the specified properties.
 */
export const pickValid = (o, ...props) => {
  const newObj = pick(o, ...props);
  // Remove undefined or null values.
  for (const k of Object.keys(newObj)) {
    if (typeof newObj[k] === 'undefined' || newObj[k] === null) {
      delete newObj[k];
    }
  }
  return newObj;
};

/**
 * Recursively loop through an object and rename all keys with a function.
 * @param  {Object} obj                  The object to transform
 * @param  {Object} keyRenamer(string)   The function that handles key renaming
 * @return {Object}                      A clone of the original object with camelCase keys
 */
export const renameKeyDeep = (obj, keyRenamer) => {
  const newObj = Array.isArray(obj) ? [] : {};
  for (const k of Object.keys(obj)) {
    const newKey = keyRenamer(k);
    newObj[newKey] =
      typeof obj[k] === 'object' && obj[k] !== null
        ? renameKeyDeep(obj[k], keyRenamer)
        : obj[k];
  }
  return newObj;
};

/**
 * Recursively loop through an object and convert all snake_case keys to camelCase.
 * @param  {Object} obj     The object to transform
 * @return {Object}         A clone of the original object with camelCase keys
 */
export const camelCaseDeep = obj => renameKeyDeep(obj, snakeToCamel);

/**
 * Recursively loop through an object and convert all camelCase keys to snake_case.
 * @param  {Object} obj     The object to transform
 * @return {Object}         A clone of the original object with snake_case keys
 */
export const snakeCaseDeep = obj => renameKeyDeep(obj, camelToSnake);
