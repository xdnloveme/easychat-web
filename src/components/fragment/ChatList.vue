<template>
  <div class="easychat-chatlist-wrapper">
    <Empty
      v-if="chatList.length === 0"
      :operateTo="'/home/square'"
      tips="你还没有好友呢"
      operateTips="去广场聊天"
      afterTips="认识新的朋友吧"
    />
    <ChatListItem
      @click="hanldeItemClick(item)"
      :info="item"
      :key="item.id"
      v-for="item in chatList"
    />
  </div>
</template>

<script>
import ChatListItem from '@/components/fragment/ChatListItem';
import Empty from '@/components/common/Empty';

export default {
  name: 'ChatList',
  components: {
    ChatListItem,
    Empty,
  },
  props: {
    chatList: {
      type: Array,
      required: true,
    },
  },
  methods: {
    hanldeItemClick (item) {
      this.$emit('itemClick', item);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
