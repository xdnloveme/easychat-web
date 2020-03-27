import axios from 'axios';
import store from '@/store/';
import router from '@/router';

const HOST_URL = '/';
const DEFAULT_CONFIG = {
  method: 'GET',
  url: HOST_URL,
};

axios.defaults.baseURL = HOST_URL;

axios.interceptors.request.use(
  config => {
    if (store.state.token && store.state.token !== '') {
      config.headers['Authorization'] = `Bearer ${store.state.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    const { code } = response.data;

    if (code === 10007 || code === 10009) {
      router.push({
        path: '/auth',
      });
    }

    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default function fetch (config = {}, params = null) {
  return new Promise((resolve, reject) => {
    let resolveConfig = {};

    if (typeof config === 'string') {
      resolveConfig = Object.assign(DEFAULT_CONFIG, {
        url: config,
      });
      if (params) resolveConfig['params'] = params;
    }

    if (typeof config === 'object') Object.assign(resolveConfig, config);

    axios
      .request(resolveConfig)
      .then(res => {
        if (res.status !== 200) {
          reject(res);
        }
        const data = res.data;
        resolve(data);
      })
      .catch(err => {
        console.dir(err);
        if (err.response && err.response.data) {
          reject(err.response.data);
        }

        if (!err.response) {
          reject(handleRequestError(err));
        }
        reject(err);
      });
  });
}

function handleRequestError (e) {
  const message = e.message;
  const errorPayload = {
    state: false,
    message: '',
  };
  switch (message) {
    case 'Network Error':
      errorPayload.message = '网络连接异常';
      break;
    default:
      errorPayload.message = '网络异常🙁';
      break;
  }
  return errorPayload;
}

