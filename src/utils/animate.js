/**
 * @file 动画方法封装类(可以继续优化，比如动画缓存，掉帧问题)
 * @author tangyida <530063113@qq.com>
 */
import { easeInOutCubic, easeOutCubic } from './utils';

const linearMethod = pos => pos;

const now = () => Date.now() || new Date().getTime();

// 帧数期望值，每秒60帧
const desiredFrames = 60;
// 1秒 = 1000毫秒
const millisecondsPerSeconds = 1000;

export default class Animate {
  _isAnimating = false;

  constructor (name, duration, easing = 'linear') {
    this.name = name;
    this.duration = duration;
    this.easingMethod = this._getEasingMethod(easing);
    this._events = {};
    this._cache = [];
  }

  start (stepCallback) {
    this.startTimestamp = now();
    this.percent = 0;
    // 上下文
    const context = this;

    this._isAnimating = true;

    this.step = () => {
      const nowTimestamp = now();
      if (this.duration) {
        this.percent = (nowTimestamp - this.startTimestamp) / this.duration;
        if (this.percent > 1) {
          this.percent = 1;
        }
      }

      const computedPercent = this.easingMethod(this.percent);

      if (typeof stepCallback !== 'function') {
        throw new Error('回调必须是一个函数');
      }
      stepCallback.call(this, _handleNext, computedPercent, nowTimestamp);
    };

    function _handleNext (status) {
      if (!context._isAnimating) return;
      if (context.percent === 1 || status === false || status === 'complete') {
        // 完成动画
        context._isAnimating = false;
        // 调用缓存的注册事件
        context._events['complete'] && context._events['complete'].apply(context);
        return;
      }
      return window.requestAnimationFrame(context.step);
    }

    this.animateId = window.requestAnimationFrame(this.step);
  }

  // 取消动画
  cancel () {
    this._isAnimating = false;
    this.percent = 0;
    this._cache = [];
  }

  // 动画暂停（可继续）
  stop () {
    this._isAnimating = false;
    this._cache.push({
      startTimestamp: this.startTimestamp,
      nowTimestamp: now(),
      percent: this.percent,
    });
  }

  continue () {
    this._isAnimating = true;
    const cacheData = this._cache.find(i => i.startTimestamp === this.startTimestamp);
    // 找不到说明没有缓存
    if (!cacheData) {
      return console.warn('cannot find data from cache,check if animate could continue?');
    }
    const { startTimestamp, percent, nowTimestamp } = cacheData;

    this.percent = percent;
    this.startTimestamp = now() + (startTimestamp - nowTimestamp);
    // 动画
    return window.requestAnimationFrame(this.step);
  }

  // 动画实例销毁
  destroy () {
    this._isAnimating = false;
    if (window.cancelAnimationFrame) {
      this.animateId && window.cancelAnimationFrame(this.animateId);
    }
    this._events = {};
    this._cache = [];
    this.step = null;
  }

  _getEasingMethod = easing => {
    switch (easing) {
      case 'linear':
        return linearMethod;
      case 'ease-in-out':
        return easeInOutCubic;
      case 'ease-out':
        return easeOutCubic;
      default:
        return linearMethod;
    }
  };

  /**
   * 
   * @param {string} name 事件名称 支持的事件['compelete']
   * @param {function} callback 回调
   */
  on (name, callback) {
    this._events[name] = callback;
  }
}
