import fetch from './config.js';

export const registerSubmit = ({ username, password, email, nickname, sex }) =>
  fetch({
    method: 'POST',
    url: '/api/user/public/register',
    data: {
      username,
      password,
      email,
      nickname,
      sex,
    },
  });

export const isUsernameRegister = username =>
  fetch('/api/user/public/isUsernameRegister', {
    username,
  });

export const createActiveKey = email =>
  fetch('/api/user/public/createActiveKeyRestful', {
    email,
  });

export const login = (username, password) =>
  fetch({
    method: 'POST',
    url: '/api/user/public/login',
    data: {
      username,
      password,
    },
  });

export const logout = () =>
  fetch({
    method: 'POST',
    url: '/api/user/logout',
  });

export const modifyPublicInfo = publicInfo =>
  fetch({
    method: 'POST',
    url: '/api/user/modifyPublicInfo',
    data: {
      publicInfo,
    },
  });
