import immer from 'immer';

export default (state = [], action) => {
  return immer(state, draft => {
    const { type, err } = action;
    if (err) {
      console.error(type, err); // eslint-disable-line
      draft.push({
        type,
        time: Date.now(),
        err: err.message || 'An unknown action error occured',
      });
    }
  });
};
