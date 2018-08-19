import immer from 'immer';
import * as errors from '../errors';
import * as user from '../user';
import * as repos from '../repos';

const immerReducer = store => (state = store.initialState, action) => {
  return immer(state, draft => {
    store.reducer(draft, action);
  });
};

export default {
  errors: immerReducer(errors),
  user: immerReducer(user),
  repos: immerReducer(repos),
};
