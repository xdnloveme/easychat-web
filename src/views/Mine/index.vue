<template>
  <div class="mine">
    <ChatListCell @click="chooseCell" :key="item.name + $key" :options="item" v-for="(item, $key) in list">
      <template v-slot:main>
        <component :is="item.renderMain" />
      </template>
    </ChatListCell>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Vue from 'vue';
import ChatListCell from '@/components/fragment/ChatListCell';
import MineInfoCell from './components/MineInfoCell';

const INIT_LIST = [
  {
    name: '个人信息',
    renderMain: MineInfoCell,
    to: '/mine/edit',
  },
  {
    name: '我的',
    hideRightArrow: true,
  },
  {
    id: 'openId',
    name: '简聊号',
    desc: null,
    hideRightArrow: true,
  },
  {
    name: '设置',
    to: '/mine/setting',
  },
];

export default {
  name: 'mine',
  components: {
    ChatListCell,
  },
  computed: {
    ...mapState({
      openId: ({ publicInfo }) => publicInfo.openId,
    }),
    list () {
      return INIT_LIST.map(item => {
        const { id } = item;
        if (id) {
          return {
            ...item,
            desc: this[id],
          }
        }
        return item;
      })
    },
  },
  methods: {
    chooseCell (item) {
      // console.log(item);
    },
  },
};
</script>

<style scoped></style>
