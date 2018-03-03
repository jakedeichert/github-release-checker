import 'static/html/index.html';
import localforage from 'localforage';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import AppRoot from 'components/AppRoot';
import { store } from 'store/init';

localforage.config({
  driver: localforage.INDEXEDDB,
});

render(
  <Provider store={store}>
    <AppRoot />
  </Provider>,
  document.getElementById('app')
);
