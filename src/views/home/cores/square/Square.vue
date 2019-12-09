<template>
  <div class="mine">
    <ChatListCell 
      @click="chooseCell" 
      :key="item.name + $key" 
      :options="item" 
      v-for="(item, $key) in list"
    />
  </div>
</template>

<script>
import ChatListCell from '@/components/fragment/ChatListCell';
import squareChat from '@/assets/icon/square_chat.svg';

export default {
  name: 'mine',
  components: {
    ChatListCell,
  },
  data () {
    return {
      list: [
        {
          name: '广场聊天',
          leftIcon: squareChat,
          to: '/chat/square',
        },
        {
          name: '世界之窗',
          leftIcon: squareChat,
          desc: '敬请期待',
        },
      ],
    };
  },
  methods: {
    chooseCell (item) {
      // console.log(item);
    },
  },
};
</script>

<style scoped>
</style>

