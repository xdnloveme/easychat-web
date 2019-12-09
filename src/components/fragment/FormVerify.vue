<template>
  <div class="step-group">
    <template v-if="type === 'radio'">
      <div class="radio-title">{{ propsData.title }}</div>
      <label :key="radio.id" v-for="radio in radioBox" class="radio-wrap-box">
        <span :class="['radio-inner', radioPicked === radio.value ? 'radio-inner-checked' : '']"></span>
        <input
          class="radio-i-input"
          type="radio"
          :name="radio.id"
          :value="radio.value"
          @change="radioChangeEvent"
          v-model="radioPicked"
        />
        <span class="radio-desc">{{ radio.desc }}</span>
      </label>
    </template>
    <template v-else>
      <input
        :placeholder="placeholder"
        :name="name"
        :value="value"
        v-on:input="isStart = true && $emit('input', $event.target.value)"
        :class="['input-c', !veryifyData.state && showVeryify && isStart ? 'input-warning' : '', inputType(type)]"
        :type="type"
      />
    </template>
    <div :style="hidden(veryifyData.state)" class="veryify-msg">
      <span>{{ veryifyData.message }}</span>
    </div>
  </div>
</template>

<script>
import { debounce, throttle } from '@/utils/utils';

export default {
  name: 'InputGroup',
  props: {
    placeholder: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    veryifyData: {
      type: Object,
      required: true,
    },
    showVeryify: {
      type: Boolean,
      required: false,
      default: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    propsData: {
      type: Object,
      required: false,
    },
    debounce: {
      type: Object,
      required: false,
    },
  },
  data () {
    return {
      isStart: false,
      radioBox: [],
      radioPicked: null,
      debouncedFun: null,
      localMessage: null,
      isContinueDebounce: true,
      debounceDefault: {
        duration: {
          time: 500,
          message: '',
        },
      },
    };
  },
  created () {
    this.init();
  },
  computed: {
    veryifyMsg () {
      if (this.localMessage && this.localMessage.length > 0) {
        return this.localMessage;
      }
      return this.veryifyMessage;
    },
  },
  watch: {
    value (val, oldValue) {
      if (this.debouncedFun) {
        const _debounce = this.debounce;
        this.isContinueDebounce = true;
        // 根据钩子函数返回值表示是否进行节流操作，true则继续
        if (_debounce.start) {
          this.isContinueDebounce = _debounce.start();
          if (this.isContinueDebounce === undefined) this.isContinueDebounce = true;
        }

        this.localMessage = _debounce.duration.message;
        this.debouncedFun.apply(this);
      }
    },
  },
  methods: {
    radioChangeEvent ($event) {
      this.$emit('input', $event.target.value);
    },
    init () {
      this.typeAssert(this.type);
      this.radioInit();
      this.debounceInit();
    },
    radioInit () {
      if (this.type === 'radio') {
        this.radioBox = this.propsData.radioBox;
        this.radioPicked = this.$props.value;
      }
    },
    debounceInit () {
      if (this.debounce) {
        if (!this.debounce.process || typeof this.debounce.process !== 'function') {
          throw new Error('输入节流函数必须定义process执行函数');
        }
        const _initData = { ...this.debounceDefault, ...this.debounce };
        this.debouncedFun = debounce(function () {
          if (!this.isContinueDebounce) {
            return;
          }
          this.localMessage = null;
          return this.debounce.process();
        }, _initData.duration.time);
      }
    },
    inputType (value) {
      switch (value) {
        case 'radio':
          return 'input-radio';
        case 'checkbox':
          return 'input-checkbox';
        default:
          return '';
      }
    },
    hidden (state) {
      if (state || !this.isStart || !this.showVeryify) {
        return {
          visibility: 'hidden',
        };
      }
      return {};
    },
    typeAssert (type) {
      let flag = true;
      let message = '';
      switch (type) {
        case 'radio':
          if (!this.propsData || !this.propsData.radioBox) {
            flag = false;
            message = 'radioBox';
          }
          break;
        case 'checkbox':
          if (!this.propsData || !this.propsData.checkBox) {
            flag = false;
            message = 'checkBox';
          }
          break;
        default:
          break;
      }
      if (!flag) {
        throw new Error(`在类型为${type}，需要定义propsData字段:【${message}】进行列表数据的传入`);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.step-group {
  position: relative;
  width: 100%;
}

.placeHoldSpan {
  position: absolute;
  line-height: 40px;
  padding-left: 10px;
  color: gray;
  font-size: 16px;
  z-index: -1;
}

.input-c {
  border: none;
  border-bottom: 1px solid #ddd;
  outline: none;
  height: 40px;
  font-size: 16px;
  width: 100%;
  background-color: transparent;
  padding-left: 2px;
}

.input-radio {
  height: auto;
  width: auto;
}

.input-warning {
  border-bottom-color: #ed143d;
}

.veryify-msg {
  color: #ed143d;
  font-size: 13px;
  padding-top: 6px;
  padding-bottom: 6px;
  text-align: left;
  white-space: normal;
  min-height: 1em;
}

.radio-title {
  font-size: 0.92em;
  font-weight: 400;
  margin-bottom: 10px;
  color: #606266;
}

.radio-input {
  opacity: 0;
}

.radio-wrap-box {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
}

.radio-inner {
  border: 1px solid #dcdfe6;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: middle;
}

.radio-inner-checked {
  border-color: #24292d;
}

.radio-inner:after {
  position: absolute;
  width: 10px;
  height: 10px;
  left: 3px;
  top: 3px;
  border-radius: 6px;
  display: table;
  border-top: 0;
  border-left: 0;
  content: ' ';
  background-color: #24292d;
  opacity: 0;
}

.radio-i-input {
  opacity: 0;
  outline: none;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
}

.radio-desc {
  margin-left: 8px;
  margin-right: 12px;
  vertical-align: middle;
  font-size: 16px;
  display: inline-block;
}

.radio-inner-checked::after {
  opacity: 1;
}
</style>
