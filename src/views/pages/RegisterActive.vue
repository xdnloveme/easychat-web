<template>
  <div class="register-active">
    <div class="register-active-icon">
      <img class="no-active-img" src="@/assets/icon/cry2.svg"/>
    </div>
    <h2 class="register-active-title">账户还未激活？</h2>
    <p class="register-active-desc">如果长时间没有收到激活邮件，您可在下方输入框输入您注册的邮箱再发送一封激活邮件进行激活。</p>
    <div class="no-active-input-container">
      <input v-model="content" class="no-active-input email-content"/>
      <span class="email-sign">@</span>
      <input v-model="suffix" class="no-active-input email-suffix"/>
    </div>
    <div class="btn-container">
      <a href="javascript:;" @click="active" class="btn">发送邮件激活</a>
      <p v-show="isShowSuccess" class="success-desc">邮件已成功发送，请查收!</p>
    </div>
  </div>
</template>

<script>
import validation from '@/utils/validation'
import registerService from '@/service/register';

export default {
  name: 'RegisterActive',
  data () {
    return {
      content: '',
      suffix: 'qq.com',
      isShowSuccess: false,
    }
  },
  created () {
    
  },
  methods: {
    active () {
      const email = `${this.content}@${this.suffix}`;
      let validateData = validation.emailValidate(email);
      if (!validateData.state) {
        this.$toast(validateData.message).toast();
        return;
      }
      let submitT = this.$toast({
        type: 'loading',
        message: '正在发送',
      });
      submitT.show();
      registerService.sendEmailActive(email)
      .then(result => {
        submitT.destroy();
        this.$toast(result.message).toast();
        console.log(result);
        if (result.state) {
          this.isShowSuccess = true;
          this.content = '';
        }
      })
      .catch(e => {
        console.log(e);
      })
    },
  },
}
</script>

<style scoped lang="scss">
.register-active {
  .register-active-icon {
    text-align: center;
    padding-top: 36px;
    padding-bottom: 36px;

    .no-active-img {
      vertical-align: text-top;
      height: 64px;
      width: 64px;
      margin-right: 6px;
    }
  }

  .register-active-desc {
    color: #696969;
    padding: 0px 36px;
    text-align: center;
    font-size: .94em;
  }

  .register-active-title {
    font-size: 1.4em;
    text-align: center;
  }

  .no-active-input-container {
    display: flex;
    margin-top: 30px;
    padding: 0 44px;

    .no-active-input {
      height: 36px;
      line-height: 36px;
      font-size: 1.2em;
      border: none;
      border-bottom: 1px solid #ddd;
    }

    .no-active-input:focus {
      outline: none;
    }

    .email-content {
      width: 100%;
      flex: 1;
      text-align: center;
      margin-right: 10px;
    }

    .email-suffix {
      width: 100px;
      padding-left: 10px;
    }

    .email-sign {
      font-size: 1.6em;
      height: 36px;
      line-height: 36px;
      vertical-align: middle;
    }
  }

  .btn-container {
    padding: 44px 50px;
    text-align: center;

    .btn {
      display: block;
      height: 44px;
      line-height: 44px;
      color: #ffffff;
      text-decoration: none;
      background-color: $easychat-primary-color;
      border-radius: 2px;
    }

    .success-desc {
      margin: 0;
      color: #ed143d;
      margin-top: 4px;
      font-size: .9em;
    }
  }
}
</style>

