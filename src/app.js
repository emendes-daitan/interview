import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest/client';
import socketio from 'feathers-socketio/client';
import io from 'socket.io-client';
import axios from 'axios';
import config from './config';

const host = clientUrl => (__SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : clientUrl);

const configureApp = transport =>
  feathers()
    .configure(transport)
    .configure(hooks());

export const socket = io('', { path: host('/ws'), autoConnect: false });

export function createApp(req) {
  if (req === 'rest') {
    return configureApp(rest(host('/api')).axios(axios));
  }

  if (__SERVER__ && req) {
    const app = configureApp(rest(host('/api')).axios(axios.create({
      headers: {
        Cookie: req.get('cookie')
      }
    })));

    return app;
  }

  return configureApp(socketio(socket));
}
