<template>
  <div>
    <div class="not-found-container">
      <h2 class="not-found-title">404</h2>
      <img class="not-found-img" :src="imgNotFound" />
    </div>
    <div class="not-found-desc">
      <p class="not-found-desc-p">
        页面飞走了，找不到你需要的页面，{{ count }}秒后自动返回主页，或者直接点击返回。
      </p>
    </div>
    <div class="not-found-return">
      <router-link :to="'/home/easychat'" replace class="not-found-return-btn">返回首页</router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import notFound from '@/assets/icon/404/notFound.svg';

export default {
  name: 'NotFoundComponent',
  data () {
    return {
      imgNotFound: notFound,
      count: 5,
    };
  },
  mounted () {
    this.timer = setInterval(() => {
      if (this.count === 0) {
        this.$router.replace({
          name: 'home',
          params: {
            tabbarId: 'easychat',
          },
        });
        clearInterval(this.timer);
        return;
      }
      this.count--;
    }, 1000);
  },
  beforeDestroy () {
    this.timer && clearInterval(this.timer);
  },
};
</script>

<style scoped lang="scss">
.not-found-container {
  padding-top: 100px;
  text-align: center;

  .not-found-img {
    height: 128px;
    width: 128px;
  }

  .not-found-title {
    font-size: 3em;
    margin: 0px;
    color: $easychat-primary-color;
  }
}

.not-found-desc {
  padding: 0 55px;
  font-size: 0.88em;
  text-align: center;
  margin-top: 10px;

  .not-found-desc-p {
    color: #9e9e9e;
  }
}

.not-found-return {
  padding: 0 55px;
  margin-top: 50px;

  .not-found-return-btn {
    display: block;
    text-align: center;
    background-color: $easychat-primary-color;
    color: #ffffff;
    text-decoration: none;
    border-radius: 2px;
    height: 36px;
    line-height: 36px;
  }
}
</style>
