export const actionErr = (dispatch, type, err) => {
  dispatch({
    type: `${type}_ERR`,
    err,
  });
  throw err;
};

export const mapById = items => {
  return items.reduce((map, i) => {
    map[i.id] = i;
    return map;
  }, {});
};

export const mapModelById = (items, model) => {
  return items.reduce((map, i) => {
    map[i.id] = new model(i);
    return map;
  }, {});
};
