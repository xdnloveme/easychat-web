/**
 * @file 工具类方法模块
 * @author tangyida <530063113@qq.com>
 */
import { Success, CustomError } from '@/utils/service-response-temp';

let elementStyle = document.createElement('div').style;

// css前缀
function vendor (prop) {
  let ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
  let transformNames = {
    webkit: `webkit${ucProp}`,
    Moz: `Moz${ucProp}`,
    O: `O${ucProp}`,
    ms: `ms${ucProp}`,
    standard: prop,
  };

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
}

export function prefixStyle (style) {
  const ret = vendor(style);
  if (ret === false) {
    return false;
  }

  if (ret === 'standard') {
    return style;
  }

  return ret + style.charAt(0).toUpperCase() + style.substr(1);
}

/**
 * 函数防抖 debounce
 * @param {Object} func 要执行的函数
 * @param {Object} wait 延迟时间
 * @param {Object} immediate 是否立即执行
 */
export const debounce = function (func, wait, immediate) {
  let timeout, result;

  let debounced = function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      let callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }

    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};

/**
 * 函数节流 throttle
 * @param {Object} func 要执行的函数
 * @param {Object} wait 等待时间
 * @param {Object} options 配置项，配置是否立即/延迟执行（二选一）
 */
export const throttle = function (func, wait, options) {
  let timeout, context, args, result;
  let previous = 0;
  if (!options) options = {};

  let later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  let throttled = function () {
    let now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };

  return throttled;
};

/**
 * <--代理模式-->
 * 这是一个service层 》》》view 视图层的代理返回，统一处理错误，让视图层专注于显示，业务层专注于执行。
 * @param {function} func 需要执行的方法名
 * @param {function} intercept 返回数据前的拦截
 */
export const response = (func, intercept) => {
  return new Promise((resolve, reject) => {
    try {
      func
        .call(this)
        .then(res => {
          let _fin = res.code !== 0 ? new CustomError(res) : new Success(res);
          if (intercept && typeof intercept === 'function') {
            intercept(_fin);
          }
          resolve(_fin);
        })
        .catch(e => {
          resolve(
            new CustomError({
              message: e.message,
              code: e.status,
            }),
          );
        });
    } catch (e) {
      reject(e);
    }
  });
};

// ease-out 贝塞尔动画
export const easeOutCubic = function (pos) {
  return Math.pow(pos - 1, 3) + 1;
};

// ease-in-out 贝塞尔动画
export const easeInOutCubic = function (pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3);
  }
  return 0.5 * (Math.pow(pos - 2, 3) + 2);
};

// 格式化时间戳
export const formatTimestamp = timestamp => {
  if (typeof timestamp !== 'string' && typeof timestamp !== 'number') {
    return '';
  }
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const nowDate = now.getDate();

  const record = new Date(timestamp);
  const recordYear = record.getFullYear();
  const recordMonth = record.getMonth() + 1;
  const recordDate = record.getDate();

  const formatDate = (y, m, d) => {
    let fm = m < 10 ? '0' + m : m;
    const fd = d < 10 ? '0' + d : d;
    return `${y}-${fm}-${fd}`;
  };

  const oneDayTimestamp = 24 * 3600 * 1000;

  const isToday = nowYear === recordYear && nowMonth === recordMonth && nowDate === recordDate;
  const isYesterday =
    new Date(formatDate(nowYear, nowMonth, nowDate)) - new Date(formatDate(recordYear, recordMonth, recordDate)) <=
    oneDayTimestamp;

  const cTimestamp = now.getTime();
  const diff = cTimestamp - timestamp;

  const secondTimestamp = 60 * 1000;
  // 最大30分钟期限
  const maxMinutesDiff = 60 * 1000 * 30;

  if (diff < secondTimestamp) {
    return '刚刚';
  }

  if (diff >= secondTimestamp && diff < maxMinutesDiff) {
    const minutesCount = diff === 0 ? 0 : diff / 1000 / 60;
    return `${parseInt(minutesCount)}分钟前`;
  }

  if (isToday) {
    return `${record.getHours()}:${record.getMinutes()}`;
  }

  if (isYesterday) {
    return '昨天';
  }

  return formatDate(recordYear, recordMonth, recordDate);
};
