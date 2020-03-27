<template>
  <div class="auth-container">
    <div v-show="isPending" class="auth-block">
      <Loading />
    </div>
    <Failure @operate="btnOperate" :options="errorOptions" v-show="!isPending && isShowFailure" />
  </div>
</template>

<script>
import Loading from '@/components/common/Loading';
import Failure from '@/components/fragment/Failure';
import { mapActions } from 'vuex';

export default {
  name: 'Auth',
  components: {
    Loading,
    Failure,
  },
  data () {
    return {
      redirect: '',
      isPending: false,
      isShowFailure: false,
      countDown: 2,
      isDisconnect: false,
      errorOptions: {
        title: '验证失败',
        desc: '',
        button: {
          name: '返回登录页',
        },
      },
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapActions({
      authToken: 'authToken',
      logout: 'logout',
    }),
    btnOperate () {
      if (this.isDisconnect) {
        return (location.href = 'https://github.com/xdnloveme');
      }
      this.backToLogin();
    },
    backToLogin () {
      this.$router.replace({
        path: '/login',
      });
    },
    async init () {
      console.log('开始验证账号token....');
      this.redirect = this.$route.query.redirect_url || '/home/easychat';
      if (!this.$store.state.token) {
        return this.backToLogin();
      }
      this.isPending = true;
      this.authToken()
        .then(({ state, data }) => {
          if (!state) {
            this.isShowFailure = true;
            const message = data.message;
            this.setOptions('desc', `${message || 'token验证失败'}，${this.countDown}秒后返回登录页面`);

            this.timer = setInterval(() => {
              this.countDown = this.countDown - 1;

              this.setOptions('desc', `${message || 'token验证失败'}，${this.countDown} 秒后返回登录页面`);

              if (this.countDown < 0) {
                clearInterval(this.timer);
                return this.backToLogin();
              }
            }, 1000);

            return;
          }
          this.$router.replace({
            path: this.redirect,
          });
        })
        .catch(err => {
          this.isShowFailure = true;
          this.$toast(err.message).toast();
          this.setOptions(
            ['desc', 'title', 'button'],
            [
              err.message || '服务器好像开小差了',
              '无法连接到服务',
              {
                name: '去Github提issues',
              },
            ],
          );
          this.isDisconnect = true;
        })
        .finally(() => {
          this.isPending = false;
        });
    },
    setOptions (keys, value) {
      if (Array.isArray(keys)) {
        Object.values(keys).forEach((key, i) => {
          if (Array.isArray(value)) {
            this.errorOptions[key] = value[i] || '222';
          }
        });
      } else {
        this.errorOptions[keys] = value;
      }
    },
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style scoped lang="scss">
.auth-container {
  text-align: center;
  padding-top: 60px;

  .auth-block {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 300px;
    margin: auto;
  }
}
</style>
