<template>
  <div class="avatar-store-wrapper">
    <div class="avtar-preview-wall">
      <div class="avatar-preview-cover" :style="previewCoverStyle"></div>
      <ImageWall :imgSrc="localAvatar" width="100px" height="100px" class="avatar-preview-img" />
    </div>
    <div class="avtar-preview-content">
      <div class="tips">
        <img :src="shopIcon" />
        <span>现头像商店只给予固定的通用头像</span>
      </div>
      <div v-show="operateVisible" class="avatar-operate">
        <Button size="large" @click="confirmModify">确认修改</Button>
      </div>
      <div class="avtar-group">
        <Scroll :height="avatarListHeight">
          <AvatarList @avatarClick="handleAvatarClick" title="通用头像" :avatarList="list" />
        </Scroll>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { getAvatarList } from '@/api/data';
import ImageWall from '@/components/ImageWall';
import Scroll from '@/components/Scroll';
import AvatarList from './components/AvatarList';
import Button from '@/components/Button';
import shopIcon from './assets/shop.svg';

export default {
  name: 'Avatar',
  components: {
    ImageWall,
    Scroll,
    Button,
    AvatarList,
  },
  computed: {
    ...mapState({
      publicInfo: 'publicInfo',
    }),
    previewCoverStyle () {
      return {
        backgroundImage: `url(${this.localAvatar})`,
      };
    },
    avatarListHeight () {
      const { SCREEN_HEIGHT } = this.$global;
      return SCREEN_HEIGHT - 280;
    },
    operateVisible () {
      return this.publicInfo.avatar !== this.localAvatar;
    },
  },
  data () {
    return {
      list: [],
      localAvatar: '',
      shopIcon,
    };
  },
  mounted () {
    this.localAvatar = this.publicInfo.avatar;
    // 头像列表
    getAvatarList().then(({ data }) => {
      const { avatarList } = data;
      this.list = avatarList.map(i => {
        return {
          imgUrl: i || '',
          isSelected: i === this.localAvatar ? true : false,
        };
      });
    });
    this.setNavTransparent();
  },
  methods: {
    ...mapActions({
      modifyPublicInfo: 'modifyPublicInfo',
    }),
    ...mapMutations({
      setNavTransparent: 'nav/SET_NAV_TRANSPARENT',
    }),
    handleAvatarClick (item) {
      this.localAvatar = item.imgUrl;
      this.list = this.list.map(i => ({
        ...i,
        isSelected: i === item ? true : false,
      }));
    },
    confirmModify () {
      const confirm = this.$confirm({
        title: '修改头像',
        content: '确定要修改当前头像吗？',
        onConfirm: () => {
          this.modifyPublicInfo({
            avatar: this.localAvatar,
          }).then(res => {
            this.$toast(res.data.message).toast();
          });
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.avatar-store-wrapper {
  .avtar-preview-wall {
    overflow: hidden;
    height: 280px;
    position: absolute;
    top: 0px;
    width: 100%;
    // background-color: red;
    text-align: center;

    .avatar-preview-cover {
      filter: blur(30px);
      background-position: center;
      background-repeat: no-repeat;
      background-size: 115% auto;
      height: 280px;
    }
    .avatar-preview-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      border: 1px solid #ffffff;
      top: 50%;
      transform: translate(-50%, -20px);
      left: 50%;
      z-index: 0;
    }
  }
  .avtar-preview-content {
    padding-top: 280px;
    background-color: $easychat-background;

    .tips {
      background-color: rgba(238, 238, 238, 0.45);
      width: 100%;
      position: absolute;
      padding-left: 10px;
      line-height: 32px;
      z-index: 9;

      span {
        font-size: 13px;
        color: $easychat-font-darker;
        margin-left: 6px;
      }

      img {
        height: 20px;
        vertical-align: text-top;
      }
    }

    .avatar-operate {
      position: absolute;
      bottom: 10px;
      z-index: 1;
      width: 100%;
      padding-left: 30px;
      padding-right: 30px;
    }

    .avtar-group {
      background-color: #ffffff;
      padding-right: 8px;
      padding-left: 10px;
      position: relative;
    }
  }
}
</style>
