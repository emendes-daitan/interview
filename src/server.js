import fs from 'fs';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import PrettyError from 'pretty-error';
import http from 'http';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import createMemoryHistory from 'history/createMemoryHistory';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { trigger } from 'redial';
import config from 'config';
import createStore from 'redux/create';
import Html from 'helpers/Html';
import routes from 'routes';
import getChunks, { waitChunks } from 'utils/getChunks';
import asyncMatchRoutes from 'utils/asyncMatchRoutes';
import { ReduxAsyncConnect, Provider } from 'components';

const chunksPath = path.join(__dirname, '..', 'static', 'dist', 'loadable-chunks.json');

process.on('unhandledRejection', error => console.error(error));

const pretty = new PrettyError();
const app = express();
const server = new http.Server(app);

app
  .use(morgan('dev', { skip: req => req.originalUrl.indexOf('/ws') !== -1 }))
  .use(cookieParser())
  .use(compression())
  .use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))
  .use('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json')));

app.use('/dist/service-worker.js', (req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/');
  return next();
});

app.get('/hello', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'hello.html'));
});

app.use('/dist/dlls/:dllName.js', (req, res, next) => {
  fs.access(
    path.join(__dirname, '..', 'static', 'dist', 'dlls', `${req.params.dllName}.js`),
    fs.constants.R_OK,
    err => (err ? res.send(`console.log('No dll file found (${req.originalUrl})')`) : next())
  );
});

app.use(express.static(path.join(__dirname, '..', 'static')));

app.use((req, res, next) => {
  res.setHeader('X-Forwarded-For', req.ip);
  return next();
});

app.use(async (req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const history = createMemoryHistory({ initialEntries: [req.originalUrl] });
  const store = createStore({ history });

  function hydrate() {
    res.write('<!doctype html>');
    ReactDOM.renderToNodeStream(<Html assets={webpackIsomorphicTools.assets()} store={store} />).pipe(res);
  }

  if (__DISABLE_SSR__) {
    return hydrate();
  }

  try {
    const { components, match, params } = await asyncMatchRoutes(routes, req.originalUrl);
    await trigger('fetch', components, {
      store,
      match,
      params,
      history,
      location: history.location
    });

    const modules = [];
    const component = (
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ReduxAsyncConnect routes={routes} store={store}>
              {renderRoutes(routes)}
            </ReduxAsyncConnect>
          </ConnectedRouter>
        </Provider>
      </Loadable.Capture>
    );
    const content = ReactDOM.renderToString(component);

    const locationState = store.getState().router.location;
    if (locationState.pathname !== req.originalUrl) {
      return res.redirect(301, locationState.pathname);
    }

    const bundles = getBundles(getChunks(), modules);
    const html = <Html assets={webpackIsomorphicTools.assets()} bundles={bundles} content={content} store={store} />;

    res.status(200).send(`<!doctype html>${ReactDOM.renderToString(html)}`);
  } catch (mountError) {
    console.error('MOUNT ERROR:', pretty.render(mountError));
    res.status(500);
    hydrate();
  }
});

(async () => {
  if (config.port) {
    try {
      await Loadable.preloadAll();
      await waitChunks(chunksPath);
    } catch (error) {
      console.log('Server preload error:', error);
    }

    server.listen(config.port, err => {
      if (err) {
        console.error(err);
      }
      console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
    });
  } else {
    console.error('==>     ERROR: No PORT environment variable has been specified');
  }
})();
