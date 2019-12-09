/**
 * @file 工具通用模块
 * @author tangyida <530063113@qq.com>
 */

// 判断是否为空（不能含有空格，写空）
const isNull = (str) => {
  if (str.length === 0 || str === null || str === undefined) {
    return true;
  }
  let flag = /\s/.test(str);
  return flag;
}

// 是否全为空，或全为空格
const isNullAll = (str) => {
  if (str.length === 0 || str === null || str === undefined) {
    return true;
  }
  return /^\s+$/.test(str)
}

// 特殊字符
const special = (str) => {
  const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
  return regEn.test(str) || regCn.test(str)
}

// 是否是邮件
const isEmail = (str) => {
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
  return reg.test(str); 
}

// 简单判断两个对象是否相等
// ps: 不包括判断对象的原型链prototype，不包括深度判断属性的不可枚举属性、是否可写，只针对属性的一般属性值
// Not include (prototype, enumerablem, writable, configurable, etc...)
const isEqualObj = (source, target) => {
  // check equal directly
  if (source === target) {
    return true;
  }

  if (typeof source !== 'object' || typeof target !== 'object') {
    return false;
  }

  const _sourceOwnProperty = Object.keys(source);
  const _targetOwnProperty = Object.keys(target);

  if (_sourceOwnProperty.length !== _targetOwnProperty.length) return false;
  
  for (let i in _sourceOwnProperty) {
    if (_sourceOwnProperty[i] !== _targetOwnProperty[i]) {
      return false;
    }
    if (source.hasOwnProperty(_sourceOwnProperty[i]) && target.hasOwnProperty(_targetOwnProperty[i])) {
      const _current = source[_sourceOwnProperty[i]];
      const _target = target[_targetOwnProperty[i]]
      if (!isEqualObj(_current, _target)) {
        return false;
      }
    }
  }

  return true;
}

export {
  special,
  isNull,
  isNullAll,
  isEmail,
  isEqualObj,
}
