<template>
  <div class="setting-container">
    <div class="logout">
      <Button size="large" @click="isconfirmLogout">退出登录</Button>
    </div>
  </div>
</template>

<script>
import { Button } from 'easychat-ui';

export default {
  name: 'Setting',
  components: {
    Button,
  },
  data () {
    return {};
  },
  methods: {
    isconfirmLogout () {
      this.$confirm({
        title: '退出登录',
        content: '确定要退出登录状态吗？（您将回到登录界面）',
        onConfirm: () => {
          this.logout();
        },
        onCancel () {
          console.log('cancel ...');
        },
      });
    },
    logout () {
      const logoutProcess = this.$toast({
        type: 'loading',
      });
      logoutProcess.show();

      this.$store
        .dispatch('logout')
        .then(res => {
          this.$toast(res.message).toast();
          this.$router.replace({
            name: 'login',
          });
        })
        .catch(e => {
          this.$toast(e.message).toast();
        })
        .finally(() => {
          logoutProcess.destroy();
        });
    },
  },
};
</script>

<style scoped lang="scss">
.setting-container {
  .logout {
    padding: 20px 50px;
  }
}
</style>

