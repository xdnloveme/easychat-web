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
    }),
    btnOperate () {
      this.backToLogin();
    },
    backToLogin () {
      this.$router.replace({
        path: '/login',
      });
    },
    async init () {
      console.log('进来了');
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
            this.setDesc(`${message || 'token验证失败'}，${this.countDown}秒后返回登录页面`);

            this.timer = setInterval(() => {
              this.countDown = this.countDown - 1;

              this.setDesc(`${message || 'token验证失败'}，${this.countDown} 秒后返回登录页面`);

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
          this.$toast(err.message).toast();
        })
        .finally(() => {
          this.isPending = false;
        });
    },
    setDesc (msg) {
      this.errorOptions.desc = msg;
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

