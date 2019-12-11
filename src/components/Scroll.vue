<template>
  <div ref="wrapper" class="easychat-scroll-wrapper">
    <div ref="container" class="easychat-scroll-container">
      <slot name="mask"></slot>
      <div ref="content" :style="heightStyle" class="easychat-scroll-content">
        <slot name="header"></slot>
        <div :style="contentStyle" ref="box" class="easychat-scroll-box">
          <div v-if="isPullDownActived" :style="pullDownStyle" class="pull-down">
            <PullRefresh :text="pullDownText" :height="localPullDown.height" />
          </div>
          <slot></slot>
          <div v-if="isPullUpActived" :style="pullUpStyle" class="pull-up">
            <PullRefresh :text="pullUpText" :height="localPullUp.height" />
          </div>
        </div>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Animate from '@/utils/animate';
import PullRefresh from '@/components/common/PullRefresh';
import { debounce as debounceFun, throttle as throttleFun } from '@/utils/utils';

// 当拖拽时候的（拉取的距离比例）
const DRAG_RATE = 1 - 0.618;

// 下拉加载默认配置
const DEFAULT_PULL_DOWN_OPTIONS = {
  height: 60,
  // 下拉加载提示
  pullDownText: '下拉加载',
  // 下拉加载触发时候的文字
  pullDownActivedText: '松开刷新',
  // 下拉加载开始时候的文字
  pullDownStartText: '正在刷新',
  // 下拉加载完成时候的文字
  pullDownEndText: '加载完成',
};

// 上拉加载默认配置
const DEFAULT_PULL_UP_OPTIONS = {
  height: 60,
  pullUpText: '上拉加载',
  pullUpActivedText: '松开刷新',
  pullUpStartText: '正在刷新',
  pullUpEndText: '加载完成',
};

// 滚动设置
const DEFAULT_OPTIONS = {
  // 动画滚动时候的拦截速率
  interceptVelocityY: null,
  // 滚动到某一位置的动画持续时间
  scrollToDuration: 800,
  // 边界回弹效果的持续时间
  bounceBackDuration: 300,
  debounce: null,
  throttle: null,
};

export default {
  name: 'Scroll',
  components: {
    PullRefresh,
  },
  props: {
    height: {
      type: [Number, String],
      default: 'auto',
      required: true,
    },
    boundBounce: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default () {
        return {};
      },
    },
    pullDown: {
      type: Object,
      default: null,
    },
    pullUp: {
      type: Object,
      default: null,
    },
    pullDownLoading: {
      type: Boolean,
      default: false,
    },
    pullUpLoading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    scrollTop (currentValue, prevValue) {
      const isScrollUpward = prevValue - currentValue > 0 ? true : false;
      if (this.isOnPullDownBackToTop && currentValue === 0) {
        this.isOnPullDownBackToTop = false;
      }
      this.handlePullDownTextChange(currentValue, isScrollUpward);

      if (this.isOnPullUpBackToBottom && currentValue === -this._getScrollMaxHeight()) {
        this.isOnPullUpBackToBottom = false;
      }
      this.handlePullUpTextChange(currentValue, isScrollUpward);

      if (!this._events.onScroll) {
        return;
      }

      this.scrollEvent && this.scrollEvent();
    },
    pullDownLoading (value) {
      // 根据pullDownLoading状态来决定下拉加载（流程）
      if (value) {
        if (this.pullDownProcess) return;
        this.pullDownProcess = this.pullDownGen();
        this.pullDownProcess.next();
      } else {
        if (this.pullDownProcess) {
          let status = this.pullDownProcess.next();
          while (!status.done) {
            status = this.pullDownProcess.next();
          }
          /**
           * pull-down-end 事件
           */
          this.$emit('pull-down-end');
          this.pullDownProcess = null;
        }
      }
    },
    pullUpLoading (value) {
      // 根据pullDownLoading状态来决定下拉加载（流程）
      if (value) {
        if (this.pullUpProcess) return;
        this.pullUpProcess = this.pullUpGen();
        this.pullUpProcess.next();
      } else {
        if (this.pullUpProcess) {
          let status = this.pullUpProcess.next();
          while (!status.done) {
            status = this.pullUpProcess.next();
          }
          /**
           * pull-down-end 事件
           */
          this.$emit('pull-up-end');
          this.pullUpProcess = null;
        }
      }
    },
  },
  computed: {
    heightStyle () {
      return {
        height: typeof this.height === 'number' ? `${this.height}px` : this.height,
      };
    },
    contentStyle () {
      return {
        transform: `translate3d(0, ${this.scrollTop}px, 0)`,
      };
    },
    // 是否超出边界
    isOutOfRange () {
      const scrollHeightMax = this._getScrollMaxHeight();
      return this.scrollTop > 0 || Math.abs(this.scrollTop) > scrollHeightMax;
    },
    isPullDownActived () {
      return this.pullDown || this.pullDownLoading;
    },
    isPullUpActived () {
      return this.pullUp || this.pullUpLoading;
    },
    localOptions () {
      let formatOptions = {};
      const { debounce, throttle } = this.options;
      if (debounce || throttle) {
        ['debounce', 'throttle'].forEach(key => {
          if (typeof this.options[key] === 'number') {
            formatOptions[key] = {
              delay: this.options[key],
            };
          }
        });
      }
      return {
        ...DEFAULT_OPTIONS,
        ...this.options,
        ...formatOptions,
      };
    },
    localPullDown () {
      return {
        ...DEFAULT_PULL_DOWN_OPTIONS,
        ...this.pullDown,
      };
    },
    localPullUp () {
      return {
        ...DEFAULT_PULL_UP_OPTIONS,
        ...this.pullUp,
      };
    },
    pullDownStyle () {
      const height = this.localPullDown.height;
      return {
        height: `${height}px`,
        lineHeight: `${height}px`,
        top: `-${height}px`,
      };
    },
    pullUpStyle () {
      const height = this.localPullUp.height;
      return {
        height: `${height}px`,
        lineHeight: `${height}px`,
        bottom: `-${height}px`,
      };
    },
  },
  mounted () {
    this.init();
    this._registerEvents();
    this._initDebounce();
  },
  beforeDestroy () {
    if (this.pullDownProcess || this.pullUpProcess) {
      this.pullDownProcess = null;
      this.pullUpProcess = null;
    }
  },
  data () {
    return {
      scrollTop: 0,
      startScrollTop: 0,
      scrollHeightMax: 0,
      lastTouchTimeStamp: 0,
      velocityY: 0,
      isOnScrollAnimating: false,
      isOnScrollToAnimating: false,
      isOnPullDownBackToTop: false,
      isOnPullUpBackToBottom: false,
      isTouchMoving: false,
      position: [],
      pullDownText: DEFAULT_PULL_DOWN_OPTIONS.pullDownText,
      pullUpText: DEFAULT_PULL_UP_OPTIONS.pullDownText,
    };
  },
  methods: {
    init () {
      this.scrollHeightMax = this._getScrollMaxHeight();
      // 滚动动画实例
      this.scrollAnimate = new Animate('scroll');
      // 超出边界回弹的动画实例（250ms持续时间，ease-out动画曲线）
      const bounceBackDuration = this.localOptions['bounceBackDuration'];
      this.bounceBackAniamte = new Animate('bounce-back', bounceBackDuration, 'ease-out');
      // 监听滚动动画完成
      this.scrollAnimate.on('complete', () => {
        this.isOnScrollAnimating = false;
      });
      // 主动触发滚动到位置的动画
      const scrollToDuration = this.localOptions['scrollToDuration'];
      this.scrollToAnimate = new Animate('scroll-to', scrollToDuration, 'ease-out');
    },
    _initDebounce () {
      const emitScroll = () => {
        this.$emit('onScroll', this.scrollTop);
      };
      const { debounce, throttle } = this.localOptions;
      if (debounce || throttle) {
        this.scrollEvent = debounce ? debounceFun(emitScroll, debounce.delay) : throttleFun(emitScroll, throttle.delay);
      } else {
        this.scrollEvent = emitScroll;
      }
    },
    _registerEvents () {
      const scrollDom = this.$refs['wrapper'];
      scrollDom.addEventListener('touchstart', this.touchStartHandler, true);
      scrollDom.addEventListener('touchmove', this.touchMoveHandler, true);
      scrollDom.addEventListener('touchend', this.touchEndHandler, true);

      // beforeDestroy remove Listener
      this.$once('hook:beforeDestroy', () => {
        scrollDom.removeEventListener('touchstart', this.touchStartHandler);
        scrollDom.removeEventListener('touchmove', this.touchMoveHandler);
        scrollDom.removeEventListener('touchend', this.touchEndHandler);
      });
    },
    touchStartHandler (e) {
      // e.preventDefault();
      const currentTouch = e.touches[0] || e.targetTouches[0]

      this.isTouchMoving = false;

      // 如果正处于滚动动画中，则暂停动画（即完成）
      if (this.isOnScrollAnimating) {
        this.isOnScrollAnimating = false;
        this.scrollAnimate.cancel();
      }

      if (this.isOnScrollToAnimating) {
        this.isOnScrollToAnimating = false;
        this.scrollToAnimate.cancel();
      }

      this.startScrollTop = this.scrollTop;
      // 滑动开始的坐标Y
      this.startCoordinateY = currentTouch.clientY || currentTouch.pageY;
      // 计算滑动范围初始化
      this.computedRange = 0;
      this.position = [];
    },
    touchMoveHandler (e) {
      e.preventDefault();
      this.isTouchMoving = true;
      const nowTouch = e.touches[0] || e.targetTouches[0];
      // 滚动坐标Y
      this.nowCoordinateY = nowTouch.clientY || nowTouch.pageY;
      // 实时计算的滑动距离
      this.computedRange = this.nowCoordinateY - this.startCoordinateY;
      // 滚动偏移量
      const scrollTop = this.startScrollTop + this.computedRange;

      // 最大滚动距离
      this.scrollHeightMax = this._getScrollMaxHeight();
      // 如果最大滚动距离是负数，表明列表长度小于scroll容器长度
      if (this.scrollHeightMax > 0) {
        this.scrollTop = scrollTop;
      }

      // 如果超过容器边界，则减慢
      if (this.isOutOfRange) {
        this.scrollTop =
          scrollTop * DRAG_RATE +
          (this.scrollTop > 0 || this.scrollHeightMax < 0 ? 0 : -this.scrollHeightMax * (1 - DRAG_RATE));
      }

      const timeStamp = this._getNow();

      this.position.unshift({
        scrollTop,
        timeStamp,
      });

      // limit 20 length
      if (this.position.length > 20) {
        this.position.length = 20;
      }

      this.lastTouchTimeStamp = timeStamp;
    },
    touchEndHandler (e) {
      this.isTouchMoving = false;

      const position = this.position;
      const endPos = 0;
      let startPos = endPos;

      // 找到最后一次触摸点前最长为100ms时间的触摸点，可以获取离开触摸点时候瞬间速度
      for (let i = endPos; i < position.length && position[i].timeStamp > this.lastTouchTimeStamp - 100; i++) {
        startPos = i;
      }
      // 处理滑动超过了顶部，即将回弹
      if (this.isOutOfRange) {
        if (this.scrollTop > 0) {
          this.$emit('scroll-end', this.scrollTop);
          return this.checkPullDown() && this.handlerOutOfRange();
        } else {
          this.$emit('scroll-end', this.scrollTop);
          return this.checkPullUp() && this.handlerOutOfRange();
        }
      }

      if (startPos !== endPos) {
        const timeOffset = position[endPos].timeStamp - position[startPos].timeStamp;
        const measureMove = this.scrollTop - position[startPos - 1].scrollTop;

        const velocityY = (measureMove / timeOffset) * (1000 / 60);

        this.velocityY = velocityY;

        const minVelocityStartAnimate = 4;

        if (Math.abs(velocityY) > minVelocityStartAnimate) {
          this.velocityToAnimateScroll(velocityY);
        } else {
          /**
           * scroll-end 事件（表示滚动列表的位移事件结束了，即不会继续发生位移了，这不包括主动调用滚动事件的）
           */
          return this.$emit('scroll-end', this.scrollTop);
        }
      } else {
        this.$emit('scroll-end', this.scrollTop);
      }
    },
    handleBounceBackAnimate (startScrollTop, targetScrollTop) {
      this.bounceBackAniamte.start((next, value, now) => {
        const readyScrollTopDiff = targetScrollTop - startScrollTop;
        this.scrollTop = startScrollTop + value * readyScrollTopDiff;
        next();
      });
    },
    handlePullDownTextChange (scrollTop, isScrollUpward) {
      if (scrollTop > 0 && this.isPullDownActived) {
        if (this.pullDownProcess) {
          this.pullDownText = this.localPullDown['pullDownStartText'];
          return;
        }
        const PULL_HEIGHT = this.localPullDown.height;
        if (scrollTop >= PULL_HEIGHT) {
          this.pullDownText = this.localPullDown['pullDownActivedText'];
        } else {
          this.pullDownText =
            isScrollUpward && this.isOnPullDownBackToTop
              ? this.localPullDown['pullDownEndText']
              : this.localPullDown['pullDownText'];
        }
      }
    },
    handlePullUpTextChange (scrollTop, isScrollUpward) {
      const SCROLL_MAX_HEIGHT = this._getScrollMaxHeight();
      if (Math.abs(scrollTop) > SCROLL_MAX_HEIGHT && this.isPullUpActived) {
        if (this.pullUpProcess) {
          this.pullUpText = this.localPullUp['pullUpStartText'];
          return;
        }
        const PULL_HEIGHT = this.localPullUp.height;
        if (Math.abs(scrollTop) >= PULL_HEIGHT + SCROLL_MAX_HEIGHT) {
          this.pullUpText = this.localPullUp['pullUpActivedText'];
        } else {
          this.pullUpText =
            !isScrollUpward && this.isOnPullUpBackToBottom
              ? this.localPullUp['pullUpEndText']
              : this.localPullUp['pullUpText'];
        }
      }
    },
    handlerOutOfRange () {
      if (!this.isOutOfRange) {
        return;
      }
      if (this.scrollTop > 0) {
        this.handleBounceBackAnimate(this.scrollTop, 0);
      } else if (Math.abs(this.scrollTop) > this.scrollHeightMax) {
        this.handleBounceBackAnimate(this.scrollTop, this.scrollHeightMax < 0 ? 0 : -this.scrollHeightMax);
      } else {
        return;
      }
    },
    checkPullDown () {
      if (this.isPullDownActived) {
        const PULL_HEIGHT = this.localPullDown.height;
        if (this.pullDownProcess) {
          this.handleBounceBackAnimate(this.scrollTop, PULL_HEIGHT);
          return false;
        }
        if (this.scrollTop > PULL_HEIGHT) {
          /**
           * pull-down-start 下拉加载触发开始事件
           */
          this.$emit('pull-down-start');
          return false;
        }
      }
      return true;
    },
    checkPullUp () {
      if (this.isPullUpActived) {
        const PULL_HEIGHT = this.localPullUp.height;
        const SCROLL_MAX_HEIGHT = this._getScrollMaxHeight();
        if (this.pullUpProcess) {
          this.handleBounceBackAnimate(this.scrollTop, -(SCROLL_MAX_HEIGHT + PULL_HEIGHT));
          return false;
        }
        if (Math.abs(this.scrollTop) > PULL_HEIGHT + SCROLL_MAX_HEIGHT) {
          /**
           * pull-down-start 下拉加载触发开始事件
           */
          this.$emit('pull-up-start');
          return false;
        }
      }
      return true;
    },
    velocityToAnimateScroll (velocityY) {
      this.decelerateVelocityY = velocityY;

      const minVelocityToKeepDecelerating = 0.25;

      // 处于动画状态
      this.isOnScrollAnimating = true;
      // 开始动画
      this.scrollAnimate.start((next, value, now) => {
        const interceptVelocityY = this.localOptions['interceptVelocityY'];
        if (interceptVelocityY && Math.abs(this.decelerateVelocityY) <= interceptVelocityY) {
          this.$emit('scroll-animate-intercept', this.scrollTop);
          next('complete');
        }
        // 如果递减距离小于给定最小距离，则完成动画
        // 如果触摸到顶部或者底部，则完成动画
        if (Math.abs(this.decelerateVelocityY) < minVelocityToKeepDecelerating || this.isOutOfRange) {
          this.handlerOutOfRange();
          this.$emit('scroll-end', this.scrollTop);
          // 重要！！在未定义持续时间的情况下，需要调用next主动进入动画的complete（完成）状态
          next('complete');
        } else {
          this.scrollTop = this.scrollTop + this.decelerateVelocityY;
          this.decelerateVelocityY *= 0.95;
          next();
        }
      });
    },
    // generator 下拉加载事件流程
    *pullDownGen () {
      const PULL_HEIGHT = this.localPullDown.height;
      yield this.handleBounceBackAnimate(this.scrollTop, PULL_HEIGHT);
      yield this.handleBounceBackAnimate(this.scrollTop, 0);
      return (this.isOnPullDownBackToTop = true);
    },
    // generator 上拉加载事件流程
    *pullUpGen () {
      const PULL_HEIGHT = this.localPullDown.height;
      const SCROLL_MAX_HEIGHT = this._getScrollMaxHeight();
      yield this.handleBounceBackAnimate(this.scrollTop, -(SCROLL_MAX_HEIGHT + PULL_HEIGHT));
      yield this.handleBounceBackAnimate(this.scrollTop, -SCROLL_MAX_HEIGHT);
      return (this.isOnPullUpBackToBottom = true);
    },
    scrollTo (targetScrollTop, callback, isOnAnimating = true) {
      if (typeof targetScrollTop !== 'number') {
        throw new Error('请输入number类型的目标滑动位置');
      }

      if (this.isOnScrollAnimating) {
        this.scrollAnimate.cancel();
      }

      const measureMove = targetScrollTop - this.scrollTop;
      const startScrollTop = this.scrollTop;

      if (!isOnAnimating) {
        return (this.scrollTop = targetScrollTop);
      }

      this.isOnScrollToAnimating = true;
      this.scrollToAnimate.start((next, value, now) => {
        this.scrollTop = measureMove * value + startScrollTop;
        if (this.scrollTop === targetScrollTop) {
          this.isOnScrollToAnimating = false;
          if (callback && typeof callback === 'function') {
            return callback.call(this, this.scrollTop);
          }
        }
        next();
      });
    },
    scrollToTop (callback, isOnAnimating = true) {
      this.scrollTo(
        0,
        scrollTop => {
          if (callback && typeof callback === 'function') {
            return callback.call(this, scrollTop);
          }
        },
        isOnAnimating,
      );
    },
    scrollToBottom (callback, isOnAnimating = true) {
      const SCROLL_MAX_HEIGHT = this._getScrollMaxHeight();
      if (SCROLL_MAX_HEIGHT < 0) {
        return;
      }
      this.scrollTo(
        -SCROLL_MAX_HEIGHT,
        scrollTop => {
          if (callback && typeof callback === 'function') {
            return callback.call(this, scrollTop);
          }
        },
        isOnAnimating,
      );
    },
    _getNow () {
      return Date.now() || new Date().getTime();
    },
    _getScrollMaxHeight () {
      if (!this.$refs['box']) {
        return 0;
      }
      
      const _boundClientRect = this.$refs['box'].getBoundingClientRect();
      const diff = parseInt(_boundClientRect.height - this._getContainerHeight());
      return diff === 0 ? -1 : diff;
    },
    _getContainerHeight () {
      if (this.height && typeof this.height === 'number') {
        return this.height;
      }
      if (this.$refs['container']) {
        const _boundClientRect = this.$refs['content'].getBoundingClientRect();
        return _boundClientRect.height;
      }
      return 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.easychat-scroll-container {
  // overflow: hidden;
  touch-action: auto;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  .easychat-scroll-content {
    width: 100%;
    overflow: hidden;
    .easychat-scroll-box {
      // overflow: hidden;
    }
    .pull-down,
    .pull-up {
      position: absolute;
      width: 100%;
    }
  }
}
</style>
