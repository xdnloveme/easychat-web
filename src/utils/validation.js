/**
 * @file 表单验证模块（用户名，密码等规则）
 * @author tangyida <530063113@qq.com>
 */

import { isNull, special, isEmail } from './common';

const usernameValidate = (username) => {
  const message = '用户名不能为空、含有特殊字符，长度不能超过16'
  if (!username) {
    return {
      message,
      state: false,
    };
  }
  if (isNull(username) || special(username) || username.length > 16) {
    return {
      message,
      state: false,
    };
  }
  return { message: '通过验证', state: true };
}

const passwordValidate = (password) => {
  const message = '密码长度不能超过30、小于6，不能为空，不能含有空格。';
  if (password.length > 30 || password.length < 6 || isNull(password)) {
    return { message, state: false };
  }
  return { message: '通过验证', state: true };
}

const nicknameValidate = (nickname) => {
  const message = '昵称长度不能超过12'
  if (nickname && nickname.length > 12) {
    return { message, state: false };
  }
  return { message: '通过验证', state: true };
}

const emailValidate = (email) => {
  const message = '请输入正确的邮箱格式xx@xx.com'
  let flag = isEmail(email);
  return {
    message: flag ? '通过验证' : message,
    state: flag,
  }
}

const mustEqual = (s1, s2) => {
  return {
    state: s1 === s2,
    message: s1 === s2 ? '必须相等' : '不相等',
  }
}

const mixinRules = (...args) => {
  let mixinObj = {};
  if (typeof args[0] != 'string') {
    throw new Error('混合规则第一个参数必须是string类型，表示混合规则的信息内容。')
  }
  mixinObj.message = args[0];
  for (var i = 1; i < args.length;i++) {
    var _state = mixinObj.state ? args[i].state && mixinObj.state : args[i].state;
    Object.assign(mixinObj, {
      state: _state,
    })
  }
  return mixinObj;
}

const getRulesByFunName = (funName, ...args) => {
  let _message;
  try { 
    if(typeof(eval(funName)) == "function") {
    
      var $f = eval(`${funName}`);
      _message =  $f(...args);
      return _message;
    } else {
      throw new Error(`方法必须是函数类型，请检查您的方法名"${funName}"输入是否正确`);
    }
  } catch (e) {
    throw new Error(`"${funName}"规则未定义或发生未知错误，请确认此规则是否存在`);
  }
  
}

export default {
  usernameValidate,
  passwordValidate,
  nicknameValidate,
  emailValidate,
  mustEqual,
  mixinRules,
  getRulesByFunName,
};
