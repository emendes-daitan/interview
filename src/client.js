/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import createBrowserHistory from 'history/createBrowserHistory';
import Loadable from 'react-loadable';
import { AppContainer as HotEnabler } from 'react-hot-loader';
import { getStoredState } from 'redux-persist';
import localForage from 'localforage';
import createStore from 'redux/create';
import routes from 'routes';
import { ReduxAsyncConnect, Provider } from 'components';
import './semantic/semantic.less';

const persistConfig = {
  key: 'primary',
  storage: localForage,
  whitelist: ['info', 'question', 'questions']
};

const dest = document.getElementById('content');

(async () => {
  const storedData = await getStoredState(persistConfig);

  const history = createBrowserHistory();
  const data = { ...storedData };
  const store = createStore({
    history,
    data,
    persistConfig
  });

  const hydrate = async _routes => {
    ReactDOM.hydrate(
      <HotEnabler>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ReduxAsyncConnect routes={_routes} store={store}>
              {renderRoutes(_routes)}
            </ReduxAsyncConnect>
          </ConnectedRouter>
        </Provider>
      </HotEnabler>,
      dest
    );
  };

  await Loadable.preloadReady();

  await hydrate(routes);

  if (module.hot) {
    module.hot.accept('./routes', () => {
      const nextRoutes = require('./routes');
      hydrate(nextRoutes).catch(err => {
        console.error('Error on routes reload:', err);
      });
    });
  }
})();
