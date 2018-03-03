import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import getHydratedState from './hydrate';

// Allow Redux DevTools and block for production.
const composeEnhancers =
  process.env.NODE_ENV !== 'production'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

export const store = createStore(
  combineReducers(reducers),
  getHydratedState(),
  composeEnhancers(applyMiddleware(thunk))
);
