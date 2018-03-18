import axios from 'axios';
import config from 'config';

export default function apiClient(req) {
  const instance = axios.create({
    baseURL: __SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : '/api'
  });

  instance.interceptors.request.use(
    conf => {
      if (__SERVER__) {
        if (req.header('cookie')) {
          conf.headers.Cookie = req.header('cookie');
        }
      }
      return conf;
    },
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error.response ? error.response.data : error)
  );

  return instance;
}
