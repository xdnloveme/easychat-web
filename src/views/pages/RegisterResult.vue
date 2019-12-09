<template>
  <div class="register-result">
    <Success :options="successOptions" />
  </div>
</template>

<script>
import Success from '@/components/fragment/Success';

const DEFAULT_OPTIONS = {
  title: '注册成功',
  desc: '您的账号已经成功注册，请先激活您的账号，我们已经向您的邮箱发送了激活邮件，请查收。',
  button: {
    name: '现在登录',
    click: null,
  },
  assistance: {
    name: '没有收到激活邮件?',
    click: null,
  },
}

export default {
  name: 'RegisterResult',
  components: {
    Success,
  },
  data () {
    return {
      successOptions: DEFAULT_OPTIONS,
    };
  },
  created () {
    this.init();
  },
  methods: {
    init () {
      let _self = this;
      this.successOptions.button['click'] = function () {
        _self.$router.push({
          name: 'login',
        });
      };
      this.successOptions.assistance['click'] = function () {
        _self.$router.push({
          name: 'registerActive',
        });
      };
    },
  },
};
</script>
