import { login, logout } from '@/api/service';
import { response } from '@/utils/utils';

const loginService = async ({ username, password }) => {
  return response(async function () {
    return await login(username, password);
  })
}

const logoutService = async () => {
  return response(async function () {
    return await logout();
  })
}

export default {
  loginService,
  logoutService,
}