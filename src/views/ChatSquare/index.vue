<template>
  <div>
    <ChatRoom @avatarClick="handleAvatarClick" @send="handleSend" @resend="handleReSend" :chatList="chatList" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import { mapState, mapActions } from 'vuex';
import ChatRoom from '@/components/fragment/ChatRoom';
import chatRoom from '@/socket/chatRoom';
import Packet from '@/utils/packet';

const MESSAGE_TEMP = {
  name: '',
  message: '',
  isMine: true,
  isEmiting: true,
  isFailed: false,
};

export default {
  name: 'chatSquare',
  components: {
    ChatRoom,
  },
  data () {
    return {
      isWatchingInfo: false,
    };
  },
  created () {
    this.init();
  },
  computed: {
    ...mapState({
      publicInfo: state => state.publicInfo,
      chatList: state => state.square.chatList,
      contactsList: state => state.contacts.contactsList,
      userCounts: state => state.square.userCounts,
    }),
  },
  watch: {
    userCounts (value) {
      this.setNavInfo({
        title: `广场（${value}人在线）`,
      });
    },
  },
  methods: {
    ...mapActions({
      join: 'square/join',
      sendMessage: 'square/sendMessage',
      leave: 'square/leave',
      addTips: 'square/addTips',
      remove: 'square/remove',
      setNavInfo: 'nav/setNavInfo',
    }),
    init () {
      this.join();
    },
    handleReSend (item) {
      console.log('准备重新提交的条目', item);
    },
    handleSend (message, callback) {
      const payload = new Packet({
        message,
        isShowName: true,
      });
      this.sendMessage(payload);
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
  beforeDestroy () {
    if (this.isWatchingInfo) {
      return;
    }
    const history = {
      isTip: true,
      message: '以上为历史记录',
    };
    if (this.chatList.length > 0) {
      this.remove(history);
      this.addTips(history);
    }
    this.leave();
  },
};
</script>

<style scoped lang="scss"></style>
