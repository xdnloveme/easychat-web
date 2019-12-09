<template>
  <div class="form-input-wrapper">
    <div class="form-input_in_container">
      <div v-if="$slots.icon" class="icon-wrapper">
        <slot name="icon"></slot>
      </div>
      <input
        ref="based"
        :value="value"
        :placeholder="placeholder"
        :style="inputStyle"
        :disabled="disabled"
        @input="emitInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
        @search="type === 'search' ? handleSearch($event) : null"
        :class="['form-input_in', 'style-' + borderStyle , 'size-' + size , $slots.icon ? 'input-padding' : '' ]"
        :type="type"
      />
    </div>
  </div>
</template>

<script>
import { debounce, throttle } from "@/utils/utils.js";

export default {
  name: "FormBased",
  props: {
    // 提示语
    placeholder: {
      type: String,
    },
    // 输入框种类
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
    },
    // 输入框大小（small, default, large）
    size: {
      type: String,
      default: "default",
    },
    borderStyle: {
      type: String,
      default: "default",
    },
    inputStyle: {
      type: Object,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * @property {object|number} debounce { delay: 500, immediate: true }
     * @property {object|number} throttle { delay: 500}
     */
    options: {
      type: Object,
      default: () => {
        return {
          debounce: 500,
          throttle: 500,
        };
      },
    },
  },
  created () {
    this.init();
  },
  methods: {
    init () {
      if (this.options.debounce) {
        this.debounceFun = this.getFun("debounce");
      }

      if (this.options.throttle) {
        this.throttleFun = this.getFun("throttle");
      }
    },
    emitInput (e) {
      this.$emit("input", e.target.value);
      if (this.options.debounce) {
        this.debounceFun.call(this, e);
      }

      if (this.options.throttle) {
        this.throttleFun.call(this, e);
      }
    },
    getFun (type) {
      const _fun = function (e) {
        /**
         * @event 事件调用
         * @event debounce|throttle 
         */
        this.$emit(type, e.target.value);
      };
      const _delay =
        typeof this.options[type] === "number"
          ? this.options[type]
          : this.options[type].delay;

      const _immediate =
        typeof this.options[type] === "number"
          ? undefined
          : this.options[type].immediate;

      switch (type) {
        case "debounce":
          return debounce(_fun, _delay, _immediate);
        case "throttle":
          return throttle(_fun, _delay);
        default:
          return;
      }
    },
    handleSearch (e) {
      this.$emit("search", e);
    },
    handleBlur (e) {
      this.$emit("blur", e);
    },
    handleFocus (e) {
      this.$emit("focus", e);
    },
    handleChange (e) {
      this.$emit("change", e);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.form-input-wrapper {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  .form-input_in_container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    position: relative;

    input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }

    .icon-wrapper {
      display: inline-block;
      position: absolute;
      left: 0;

      img {
        width: 24px;
        height: 24px;
      }
    }

    .form-input_in {
      flex: 1;
      border: none;
      width: 100%;
      color: #333;
      padding: 0 10px;
      outline: none;
    }

    .size-default {
      height: 32px;
      line-height: 32px;
      font-size: 16px;
    }

    .size-small {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
    }

    .style-default {
      border-bottom: 1px solid #ddd;
    }

    .style-default:focus {
      border-color: $easychat-primary-color;
    }

    .style-normal {
      border: 1px solid #eee;
      border-radius: 4px;
    }

    .input-padding {
      padding-left: 36px;
    }
  }
}
</style>
