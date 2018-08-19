import { React, injectGlobal } from 'utils/component';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import HomePage from 'components/HomePage';

injectGlobal`
  * {
    border: 0;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 125%;
  }

  body {
    font-family: 'Helvetica Neue', 'Arial', 'sans-serif';
  }
`;

const basePath = process.env.BASE_PATH || '';

const AppRoot = () => (
  <BrowserRouter basename={basePath}>
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
);

export default AppRoot;
