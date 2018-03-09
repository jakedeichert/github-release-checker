export const actionErr = (dispatch, type) => {
  return err => {
    dispatch({
      type,
      err,
    });
  };
};
