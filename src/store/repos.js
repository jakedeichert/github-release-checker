import localforage from 'localforage';
import addMins from 'date-fns/add_minutes';
import substractMins from 'date-fns/sub_minutes';
import { selectors as userSelectors } from 'store/user';
import { actionErr } from 'utils/storeHelpers';
import * as githubApi from 'api/github';

const key = 'repos';
const cacheKey = `store:${key}`;
const cacheTtlMins = 60;
const CLEAR_REPOS = 'CLEAR_REPOS';
const RECEIVE_STARS = 'RECEIVE_STARS';
const RECEIVE_CACHED_STATE = 'RECEIVE_CACHED_STATE';
const RECEIVE_RELEASES = 'RECEIVE_RELEASES';
const RECEIVE_TAGS = 'RECEIVE_TAGS';
const MARK_ALL_AS_READ = 'MARK_ALL_AS_READ';

export const initialState = {
  byId: {
    // '1': {
    //   id: 1,
    //   name: '',
    //   ownerUsername: '',
    //   releases: [],
    //   tags: [],
    //   lastReadTagByName: '',
    //   lastReadReleaseById: '',
    // },
  },
};

export const reducer = (draft, action) => {
  switch (action.type) {
    case RECEIVE_STARS: {
      const { repos } = action;
      const unstarredRepos = Object.keys(draft.byId).filter(oldId => {
        return !repos.find(r => `${r.id}` === oldId);
      });
      unstarredRepos.forEach(id => {
        delete draft.byId[id];
      });

      repos.forEach(repo => {
        const { id, name, owner } = repo;
        // Update name and owner every time
        if (draft.byId[id]) {
          draft.byId[id].name = name;
          draft.byId[id].ownerUsername = owner.login;
          return;
        }
        draft.byId[id] = {
          id,
          name,
          ownerUsername: owner.login,
          releases: [],
          tags: [],
          lastReadTagByName: null,
          lastReadReleaseById: null,
        };
      });
      break;
    }
    case RECEIVE_CACHED_STATE: {
      const { byId } = action;
      draft.byId = byId;
      break;
    }
    case RECEIVE_RELEASES: {
      action.releases.forEach(({ repoId, releases }) => {
        const repo = draft.byId[repoId];
        const newReleases = repo.lastReadReleaseById
          ? releases.filter(r => r.id > repo.lastReadReleaseById)
          : releases;
        repo.releases = newReleases;
      });
      break;
    }
    case RECEIVE_TAGS: {
      action.tags.forEach(({ repoId, tags }) => {
        const repo = draft.byId[repoId];
        const newTags = repo.lastReadTagByName
          ? tags.slice(
              0,
              tags.findIndex(i => i.name === repo.lastReadTagByName)
            )
          : tags;
        repo.tags = newTags;
      });
      break;
    }
    case MARK_ALL_AS_READ: {
      Object.values(draft.byId).forEach(r => {
        if (r.releases.length) r.lastReadReleaseById = r.releases[0].id;
        if (r.tags.length) r.lastReadTagByName = r.tags[0].name;
        r.releases = [];
        r.tags = [];
      });
      break;
    }
    case CLEAR_REPOS: {
      draft.byId = {};
      break;
    }
  }
};

const updateCache = async (
  byId,
  forceUpdate = false,
  cacheTime = Date.now()
) => {
  if (!forceUpdate && (await isCacheValid())) return;
  const cache = {
    time: cacheTime,
    byId,
  };
  await localforage.setItem(cacheKey, cache);
};

const isCacheValid = async cache => {
  const c = cache || (await selectors.getCachedState());
  return addMins(c.time, cacheTtlMins).getTime() > Date.now();
};

export const selectors = {};

selectors.get = (state, id) => state[key].byId[id];
selectors.getAll = state => state[key].byId;
selectors.getAllValues = state => Object.values(selectors.getAll(state));
selectors.getAllReposWithUpdates = state =>
  selectors.getAllValues(state).filter(r => r.releases.length || r.tags.length);

selectors.getCachedState = async () => {
  const cache = await localforage.getItem(cacheKey);
  return cache || initialState;
};

export const actions = {};

actions.clear = () => async dispatch => {
  dispatch(clearRepos());
  // Clear the cache and invalidate the time
  updateCache({}, true, substractMins(Date.now(), cacheTtlMins + 1).getTime());
};

actions.updateCache = (forceUpdate = false) => async (dispatch, getState) => {
  const byId = selectors.getAll(getState());
  updateCache(byId, forceUpdate);
};

actions.getStars = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const username = userSelectors.getUsername(state);
    if (await isCacheValid()) return;

    const results = await githubApi.getStars(username);
    dispatch(receiveStars(results));
  } catch (err) {
    actionErr(dispatch, RECEIVE_STARS, err);
  }
};

actions.getReleases = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const repos = selectors.getAllValues(state);
    if (await isCacheValid()) return;

    const p = [];

    repos.forEach(r => {
      p.push(
        githubApi
          .getReleases(r.ownerUsername, r.name)
          .then(releases => ({ repoId: r.id, releases }))
      );
    });

    const results = await Promise.all(p);
    dispatch(receiveReleases(results));
  } catch (err) {
    actionErr(dispatch, RECEIVE_RELEASES, err);
  }
};

actions.getTags = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const repos = selectors.getAllValues(state);
    if (await isCacheValid()) return;

    const p = [];

    repos.forEach(r => {
      // Don't load tags if we have releases
      if (r.releases.length || r.lastReadReleaseById) return;
      p.push(
        githubApi
          .getTags(r.ownerUsername, r.name)
          .then(tags => ({ repoId: r.id, tags }))
      );
    });

    const results = await Promise.all(p);
    dispatch(receiveTags(results));
  } catch (err) {
    actionErr(dispatch, RECEIVE_TAGS, err);
  }
};

actions.loadCache = () => async dispatch => {
  const cache = await selectors.getCachedState();
  return dispatch(receiveCachedState(cache));
};

actions.markAllAsRead = () => async dispatch => {
  dispatch(markAllAsRead());
  dispatch(actions.updateCache(true));
};

const clearRepos = () => ({
  type: CLEAR_REPOS,
});

const markAllAsRead = () => ({
  type: MARK_ALL_AS_READ,
});

const receiveStars = repos => ({
  type: RECEIVE_STARS,
  repos,
});

const receiveCachedState = ({ byId }) => ({
  type: RECEIVE_CACHED_STATE,
  byId,
});

const receiveReleases = releases => ({
  type: RECEIVE_RELEASES,
  releases,
});

const receiveTags = tags => ({
  type: RECEIVE_TAGS,
  tags,
});
