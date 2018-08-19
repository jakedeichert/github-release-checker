import localforage from 'localforage';
import { actions as repoActions } from 'store/repos';

const key = 'user';
const cacheKey = `store:${key}`;
const RECEIVE_USER = 'RECEIVE_USER';
const SIGN_OUT = 'SIGN_OUT';

export const initialState = {
  username: '',
  apiToken: '',
};

export const reducer = (draft, action) => {
  switch (action.type) {
    case RECEIVE_USER: {
      const { username, apiToken } = action;
      draft.username = username;
      draft.apiToken = apiToken;
      break;
    }
    case SIGN_OUT: {
      draft.username = '';
      draft.apiToken = '';
      break;
    }
  }
};

const updateCache = async (username, apiToken) => {
  const cache = {
    username,
    apiToken,
  };
  await localforage.setItem(cacheKey, cache);
};

export const selectors = {};

selectors.getAll = state => state[key];
selectors.getUsername = state => state[key].username;
selectors.getApiToken = state => state[key].apiToken;
selectors.hasToken = state =>
  !!selectors.getApiToken(state) && !!selectors.getUsername(state);

selectors.getCachedState = async () => {
  const cache = await localforage.getItem(cacheKey);
  return cache || initialState;
};

export const actions = {};

actions.signIn = (username, apiToken) => dispatch => {
  dispatch(recieveUser(username, apiToken));
  updateCache(username, apiToken);
};

actions.signOut = () => dispatch => {
  dispatch(signOut());
  updateCache('', '');
  dispatch(repoActions.clear());
};

actions.loadCache = () => async dispatch => {
  const { username, apiToken } = await selectors.getCachedState();
  return dispatch(recieveUser(username, apiToken));
};

const recieveUser = (username, apiToken) => ({
  type: RECEIVE_USER,
  username,
  apiToken,
});

const signOut = () => ({
  type: SIGN_OUT,
});
