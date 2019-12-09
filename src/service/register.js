import { registerSubmit, isUsernameRegister, createActiveKey } from '@/api/service';
import { response } from '@/utils/utils';

const submit = async (registerData) => {
  return response(async function () {
    return await registerSubmit(registerData);
  }, (res)=> {
    res.setData({
      isRegisterSuccess: res.state,
    });
  })
}

const isUsernameCanRegister = async (username) => {
  return response(async function () {
    return await isUsernameRegister(username);
  }, (res)=> {
    res.setData({
      isCanRegister: !res.data.isRegister,
    });
  })
}

const sendEmailActive = async (email) => {
  return response(async function () {
    return await createActiveKey(email);
  })
}

export default {
  submit,
  isUsernameCanRegister,
  sendEmailActive,
}