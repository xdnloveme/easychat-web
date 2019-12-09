import Vue from 'vue';
import Toast from './Toast.vue';
import types from './type';
import '../style.css';

let ToastConstructor = Vue.extend(Toast);

let instance;

// 默认的数据选项配置
const defaultOptions = {
  showIcon: false,
  message: '默认消息',
  iconSource: require('@/components/packages/toast/assets/loading.svg'),
};

const _Toast = function (options = defaultOptions) {
  if (typeof options === 'string') {
    options = {
      message: options,
    };
  }

  if (options && options.type) {
    options = Object.assign(types[options.type], options);
  }

  // 构造新的全局实例，准备挂载后渲染
  instance = new ToastConstructor({
    data: Object.assign({}, defaultOptions, options),
  });

  instance.vm = instance.$mount();
  // instance实例本质和instance.$mount()是一样的
  document.body.appendChild(instance.vm.$el);

  return instance.vm;
};

export default _Toast;
