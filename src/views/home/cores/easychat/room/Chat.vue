<template>
  <div>
    <ChatRoom @avatarClick="handleAvatarClick" @send="handleSend" @resend="handleReSend" :chatList="chatList" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { mapState, mapActions } from 'vuex';
import ChatRoom from '@/components/fragment/ChatRoom';
import Packet from '@/utils/packet';

export default {
  name: 'Chat',
  data () {
    return {
      nickname: null,
      openId: null,
      title: '',
    };
  },
  components: {
    ChatRoom,
  },
  created () {
    this.initChat();
  },
  computed: {
    ...mapState({
      chatServer: state => state.chatServer,
      chatServerId: state => state.chatServerId,
      publicInfo: state => state.publicInfo,
      privateChat: state => state.chat.privateChat,
      contactsList: state => state.contacts.contactsList,
    }),
    chatList () {
      const current = this.privateChat.find(item => item.openId === this.$route.query.openId);
      if (!current) return [];
      return current.record.map(item => {
        return item;
      });
    },
  },
  watch: {
    title (value) {
      this.setNavInfo({
        title: value,
      });
    },
  },
  methods: {
    ...mapActions({
      setNavInfo: 'nav/setNavInfo',
      privateMessage: 'chat/privateMessage',
      addTips: 'chat/addTips',
      updateTimestamp: 'chat/updateTimestamp',
    }),
    initChat () {
      this.nickname = this.$route.query['nickname'];
      this.title = this.nickname;
      this.openId = this.$route.query['openId'];

      const tipsObserver = Observable.create(observer => {
        const interval = setInterval(() => {
          observer.next();
        }, 1000 * 60);

        return () => clearInterval(interval);
      });

      const subscribe = tipsObserver.subscribe(this.handleUpdateTips);

      this.$once('hook:beforeDestroy', () => {
        // 销毁订阅
        subscribe.unsubscribe();
      });
    },
    handleUpdateTips () {
      this.updateTimestamp({
        openId: this.openId,
      });
    },
    handleReSend (payload) {
      this.$confirm({
        title: '重新发送',
        content: '此消息未成功发送，是否需要重新发送？',
        onConfirm: () => {
          this.privateMessage({
            payload,
            isReSend: true,
          });
        },
      })
    },
    handleSend (message) {
      const targetPublicInfo = this.contactsList.find(item => item.openId === this.openId);
      if (targetPublicInfo) {
        this.$toast('TA还不是你的通讯录好友');
      }
      const payload = new Packet({
        message,
        targetPublicInfo,
        targetOpenId: this.openId, 
      });
      this.privateMessage({ payload });
    },
    handleAvatarClick (item) {
      const { sourcePublicInfo } = item;
      this.isWatchingInfo = true;
      this.$router.push({
        name: 'UserCard',
        params: {
          userInfo: encodeURI(JSON.stringify(sourcePublicInfo)),
        },
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
