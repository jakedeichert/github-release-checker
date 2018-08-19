export const initialState = [];

export const reducer = (draft, action) => {
  const { type, err } = action;
  if (err) {
    console.error(type, err); // eslint-disable-line
    draft.push({
      type,
      time: Date.now(),
      err: err.message || 'An unknown action error occured',
    });
  }
};
