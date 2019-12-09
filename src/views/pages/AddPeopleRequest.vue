<template>
  <div class="add-people-request-wrapper">
    <div class="add-people-request-container">
      <span class="title">你需要发送请求消息，等待对方通过</span>
      <div class="input-container">
        <input v-model="message" type="text" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AddPeopleRequest',
  data () {
    return {
      openId: null,
      message: '',
    };
  },
  computed: {
    ...mapState({
      publicInfo: state => state.publicInfo,
    }),
  },
  created () {
    this.init();
  },
  methods: {
    ...mapActions({
      addFriendRequest: 'chat/addFriendRequest',
    }),
    init () {
      this.$store.commit('nav/SET_NAV_RIGHT', {
        text: '发送',
        operate: () =>{
          this.addPeople();
        },
      });
      this.openId = this.$route.query.openId;
      this.message = `我是 ${this.publicInfo.nickname}，有缘千里来相会。`;
    },
    addPeople () {
      if (!this.openId) {
        this.$toast('添加的用户简聊号不能为空，请重试').toast();
        return;
      }

      // action => `addFriendRequest`
      this.addFriendRequest({
        openId: this.openId,
        requestOpenId: this.publicInfo.openId,
        message: this.message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-people-request-container {
  background-color: $easychat-background-light;
  .title {
    display: block;
    color: $easychat-font-light;
    font-size: 0.82em;
    margin-top: 6px;
    margin-bottom: 6px;
    padding-left: 6px;
  }
  .input-container {
    input {
      width: 100%;
      outline: none;
      border: none;
      border-top: 1px solid $easychat-border;
      border-bottom: 1px solid $easychat-border;
      height: 36px;
      line-height: 36px;
      padding-left: 10px;
      font-size: 0.95em;
    }
  }
}
</style>

