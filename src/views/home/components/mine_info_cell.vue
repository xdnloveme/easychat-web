<template>
  <div class="user-info-cell">
    <div class="user-info-cell-img-c">
      <img class="user-info-cell-img" :src="avatar"/>
    </div>
    <div class="user_info">
      <div class="nickname">
        {{ nickname }}
      </div>
      <div class="personal-desc">
        {{ signature }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import leftIcon from '@/assets/icon/cry2.svg';

export default {
  name: 'mine_info_cell',
  computed: {
    ...mapState({
      nickname: ({ publicInfo }) => publicInfo.nickname,
      signature: ({ publicInfo }) => publicInfo.signature ? publicInfo.signature : '这个人很懒，什么都没有写。',
      avatar: ({ publicInfo }) => publicInfo.avatar,
    }),
  },
  data () {
    return {
      leftIcon: leftIcon,
    }
  },
}
</script>

<style scoped lang="scss">
.user-info-cell {
  display: flex;
  align-items: center;
  overflow: hidden;

  .user-info-cell-img-c {
    width: 64px;
    height: 64px;
    .user-info-cell-img {
      width: auto;
      height: 100%;
    }
  }

  .user_info {
    padding-left: 10px;
    overflow: hidden;

    .nickname {
      color: #222;
      font-size: 1.2em;
    }

    .personal-desc {
      color: #808080;
      font-size: .82em;
      overflow: hidden;
      white-space: nowrap;
      margin-top: 6px;
      text-overflow: ellipsis;
    }
  }
}
</style>

