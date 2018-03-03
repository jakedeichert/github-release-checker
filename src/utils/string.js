export const snakeToCamel = s => s.replace(/_\w/g, m => m[1].toUpperCase());
export const camelToSnake = s =>
  s.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`);
