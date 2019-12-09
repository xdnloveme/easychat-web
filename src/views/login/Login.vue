<template>
  <div class="login-warpper">
    <div class="login-logo">
      <img :src="logoImg"/>
    </div>
    <div class="login-user-input">
      <FormBased 
        placeholder="请输入邮箱/用户名" 
        v-model="username" 
        class="input-bottom" >
          <img :src="user" slot="icon" />
      </FormBased>
      <FormBased 
        placeholder="请输入您的密码"
        labelText="密码"
        type="password"
        v-model="password">
          <img :src="lock" slot="icon" />
      </FormBased>
    </div>
    <div class="login-submit-container"> 
      <a @click="login" class="login-btn" href="javascript:;">登录</a>
      <div class="login-btn-others">
        <router-link to="/register" class="login-b-o-span">现在注册</router-link>
      </div>
    </div>
    <div class="foot-operate">
      <!-- <a href="https://github.com/xdnloveme" class="foot-line register-line-a">需要帮助</a> -->
      <router-link to="/test" class="foot-line register-line-a">测试</router-link>
      <router-link to="/register/active" class="foot-line register-line-a">还未激活？</router-link>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/image/chat_logo.svg';
import FormBased from '@/components/fragment/FormBased';
import { isNull } from '@/utils/common';
import lock from '@/assets/icon/lock.svg';
import user from '@/assets/icon/user.svg';

export default {
  name: 'Login',
  components: {
    FormBased,
  },
  data () {
    return {
      logoImg: logo,
      username: '',
      password: '',
      visiable: true,
      lock,
      user,
    }
  },
  computed: {
    token () {
      return this.$store.token
    },
  },
  created () {
    document.addEventListener('keydown', this.keyboardProcess);
  },
  beforeDestroy () {
    console.log('进来了');
    document.removeEventListener('keydown', this.keyboardProcess);
  },
  methods: {
    keyboardProcess (e) {
      if (e.keyCode === 13) {
        this.login();
      }
    },
    async login () {
      if (isNull(this.username) || isNull(this.password)) {
        this.$toast('用户名或密码不能为空').toast();
        return;
      }
      let loginProcess = this.$toast({
        type: 'loading',
      });
      loginProcess.show();
      const loginResult = await this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
      });
      loginProcess.destroy();
      if (!loginResult.state) {
        this.$toast(loginResult.message).toast();
        return;
      }
      this.$router.replace({
        name: 'home',
        params: { tabbarId: 'easychat' },
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login-warpper {
  padding-top: 60px;
  
  .login-logo {
    text-align: center;
  }

  .login-user-input {
    margin-top: 50px;
    padding: 0 50px;

    .input-bottom {
      margin-bottom: 30px;
    }
  }

  .login-submit-container {
    text-align: center;
    margin-top: 72px;

    .login-btn {
      height: 44px;
      line-height: 44px;
      color: #ffffff;
      text-decoration: none;
      background-color: $easychat-primary-color;
      border-radius: 2px;
    }

    .login-btn, .login-btn-others {
      width: 240px;
      display: inline-block;
    }

    .login-btn-others {
      .login-b-o-span {
        margin-top: 10px;
        display: inline-block;
        font-size: .92em;
        color: #939399;
      }
    }
  }

  .foot-operate {
    position: absolute;
    width: 100%;
    bottom: 60px;
    text-align: center;

    .register-line-a {
      color: $easychat-primary-color;
      font-size: .82em;
      text-decoration: none;
    }

    .foot-line {
      width: 50%;
    }

    .foot-line:first-child {
      border-right: 1px solid $easychat-primary-color;
      padding-right: 10px;
    }

    .foot-line:nth-child(2n) {
      margin-left: 10px;
    }
  }
}
























</style>
