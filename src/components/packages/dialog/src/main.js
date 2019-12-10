import Vue from 'vue';
import Confirm from './Confirm.vue';

const ConfirmConstructor = Vue.extend(Confirm);

let instance_confirm;

const _confirm = function (confirmOption = {}) {
  instance_confirm = new ConfirmConstructor({
    data: Object.assign({}, confirmOption),
  });

  instance_confirm.vm = instance_confirm.$mount();

  document.body.appendChild(instance_confirm.vm.$el);

  const vm = instance_confirm.vm;

  return vm;
};

export default {
  _confirm,
};
