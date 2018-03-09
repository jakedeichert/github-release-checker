import localforage from 'localforage';
import immer from 'immer';
import addMins from 'date-fns/add_minutes';
import { selectors as userSelectors } from 'store/user';
import { actionErr } from 'utils/storeHelpers';
import * as githubService from 'services/github';

const key = 'repos';
const cacheKey = `store:${key}`;
const cacheTtlMins = 60;
const RECEIVE_STARS = 'RECEIVE_STARS';
const RECEIVE_STARS_ERR = 'RECEIVE_STARS_ERR';
const RECEIVE_CACHED_STATE = 'RECEIVE_CACHED_STATE';
const RECEIVE_RELEASES = 'RECEIVE_RELEASES';
const RECEIVE_RELEASES_ERR = 'RECEIVE_RELEASES_ERR';
const RECEIVE_TAGS = 'RECEIVE_TAGS';
const RECEIVE_TAGS_ERR = 'RECEIVE_TAGS_ERR';
const MARK_ALL_AS_READ = 'MARK_ALL_AS_READ';

const initialState = {
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

export default (state = initialState, action) => {
  return immer(state, draft => {
    switch (action.type) {
      case RECEIVE_STARS: {
        const { repos } = action;
        repos.forEach(repo => {
          const { id, name, owner } = repo;
          // TODO: owner or repo name could change
          if (draft.byId[id]) return;
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
    }
  });
};

const updateCache = async (byId, forceUpdate = false) => {
  if (!forceUpdate && (await isCacheValid())) return;
  const cache = {
    time: Date.now(),
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

actions.updateCache = (forceUpdate = false) => {
  return async (dispatch, getState) => {
    const allState = selectors.getAll(getState());
    updateCache(allState, forceUpdate);
  };
};

actions.getStars = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const apiToken = userSelectors.getApiToken(state);
    const username = userSelectors.getUsername(state);
    if (await isCacheValid()) return;

    const results = await githubService
      .getStars(username, apiToken)
      .catch(actionErr(dispatch, RECEIVE_STARS_ERR));
    dispatch(receiveStars(results));
  };
};

actions.getReleases = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const apiToken = userSelectors.getApiToken(state);
    const repos = selectors.getAllValues(state);
    if (await isCacheValid()) return;

    const p = [];

    repos.forEach(r => {
      p.push(
        githubService
          .getReleases(r.ownerUsername, r.name, apiToken)
          .then(releases => ({ repoId: r.id, releases }))
      );
    });

    return Promise.all(p)
      .then(results => {
        dispatch(receiveReleases(results));
      })
      .catch(actionErr(dispatch, RECEIVE_RELEASES_ERR));
  };
};

actions.getTags = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const apiToken = userSelectors.getApiToken(state);
    const repos = selectors.getAllValues(state);
    if (await isCacheValid()) return;

    const p = [];

    repos.forEach(r => {
      // Don't load tags if we have releases
      if (r.releases.length || r.lastReadReleaseById) return;
      p.push(
        githubService
          .getTags(r.ownerUsername, r.name, apiToken)
          .then(tags => ({ repoId: r.id, tags }))
      );
    });

    return Promise.all(p)
      .then(results => {
        dispatch(receiveTags(results));
      })
      .catch(actionErr(dispatch, RECEIVE_TAGS_ERR));
  };
};

actions.loadCache = () => {
  return async dispatch => {
    const cache = await selectors.getCachedState();
    return dispatch(receiveCachedState(cache));
  };
};

actions.markAllAsRead = () => {
  return async dispatch => {
    dispatch(markAllAsRead());
    dispatch(actions.updateCache(true));
  };
};

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
