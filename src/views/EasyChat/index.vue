<template>
  <ChatList :chatList="localPrivateChat" @itemClick="goto" />
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ChatList from '@/components/fragment/ChatList';
import userImage from '@/assets/icon/headIcon.jpeg';
import { formatTimestamp } from '@/utils/utils';

export default {
  name: 'easychat',
  components: {
    ChatList,
  },
  computed: {
    ...mapState({
      chatBadge: state => state.badge.chat,
      privateChat: state => state.chat.privateChat,
    }),
    localPrivateChat () {
      return this.privateChat.map(item => {
        const { openId } = item;
        let count = null;
        const cBadge = this.chatBadge.find(item => item.openId === openId);
        if (cBadge) {
          count = cBadge.count || null;
        }
        const copyRecord =  [...item.record];
        const latest = copyRecord.reverse().find((item, index) => !item.isTip) || {};
        return {
          ...item,
          message: latest['message'] || '',
          time: formatTimestamp(latest['timestamp'] || 0),
          badge: count,
        };
      });
    },
  },
  methods: {
    ...mapActions({
      setChatBadge: 'badge/setChatBadge',
    }),
    goto (item) {
      const { openId, nickname } = item;
      this.setChatBadge({
        openId,
        type: 'delete',
      });
      this.$router.push({
        path: '/chat',
        query: {
          openId,
          nickname,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.square-wrapper {
  display: block;
  height: 60px;
  padding: 6px 10px;
  border-bottom: 1px solid $easychat-border;
  img {
    height: 100%;
  }
}
</style>
