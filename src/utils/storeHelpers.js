export const actionErr = type => {
  return err => ({
    type,
    err,
  });
};
