<template>
  <div class="user-card">
    <div :style="coverStyle" class="user-avatar-cover">
      <div :style="coverMaskStyle" class="user-avatar-cover_mask"></div>
    </div>
    <Scroll @onScroll="handleScroll" :height="viewHeight">
      <div class="user-panel">
        <div class="skeleton"></div>
        <div class="user-avatar">
          <ImageWall width="100%" height="100%" :imgSrc="userInfo.avatar" />
        </div>
        <UserCardDetail
          :isFriend="isFriend"
          :isShowRequest="isShowRequest"
          :userInfo="userInfo"
        />
      </div>
    </Scroll>
    <ActionSheet @onSelect="handlePopupSelect" :list="operation" :visible.sync="visible" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import ImageWall from '@/components/ImageWall';
import Scroll from '@/components/Scroll';
import ActionSheet from '@/components/fragment/ActionSheet';
import UserCardDetail from './UserCardDetail';

export default {
  name: 'UserCard',
  components: {
    Scroll,
    UserCardDetail,
    ImageWall,
    ActionSheet,
  },
  created () {
    this.$store.commit('nav/SET_NAV_RIGHT', {
      icon: 'more',
      operate: () => {
        this.visible = true;
      },
    });
  },
  data () {
    return {
      userInfo: {
        avatar: '/headIcon.jpeg',
        nickname: '未知昵称',
        openId: '00000',
        sex: -1,
        signature: '什么都没有',
      },
      scale: 1,
      scrollTop: 0,
      requestOpenId: null,
      visible: false,
    };
  },
  computed: {
    ...mapState({
      contactsList: state => state.contacts.contactsList,
    }),
    // 计算是否显示用户具体信息来判断是否是好友或好友请求
    isShowRequest () {
      if (this.requestOpenId) {
        return true;
      }
      return false;
    },
    isFriend () {
      const { openId } = this.userInfo;
      return this.contactsList.some(item => item.openId === openId);
    },
    coverStyle () {
      return {
        height: `${200 + this.scrollTop}px`,
      };
    },
    coverMaskStyle () {
      return {
        height: `${200 + this.scrollTop}px`,
        transform: `scale(${(this.scale, this.scale)})`,
        backgroundImage: `url(${this.userInfo.avatar})`,
      };
    },
    viewHeight () {
      const { SCREEN_HEIGHT } = this.$global;
      return SCREEN_HEIGHT;
    },
    operation () {
      if (this.isFriend) {
        return [
          {
            key: 'delete',
            name: '删除好友',
          },
        ];
      }
      return [];
    },
  },
  mounted () {
    this.getUserInfo();
    this.setNavTransparent();
  },
  methods: {
    ...mapActions({
      handleDeleteFriend: 'chat/handleDeleteFriend',
    }),
    ...mapMutations({
      setNavTransparent: 'nav/SET_NAV_TRANSPARENT',
    }),
    getUserInfo () {
      if (this.$route.params['userInfo']) {
        try {
          this.userInfo = JSON.parse(decodeURI(this.$route.params['userInfo']));
        } catch (e) {
          console.log(e);
        }
        
        if (this.userInfo['requestOpenId']) {
          this.requestOpenId = this.userInfo['requestOpenId'];
        }
      }
    },    
    handleScroll (scrollTop) {
      const { SCREEN_HEIGHT } = this.$global;
      this.scale = 1 + (scrollTop < 0 ? 0 : scrollTop) / SCREEN_HEIGHT / 2;
      this.scrollTop = scrollTop;
    },
    handlePopupSelect (item) {
      const { key } = item;
      if (key === 'delete') {
        this.visible = false;
        this.$confirm({
          title: '删除好友',
          content: '是否确定删除好友？',
          type: 'danger',
          onConfirm: () => {
            console.log('确认了');
            const { openId } = this.userInfo;
            this.handleDeleteFriend({
              openId,
            });
          },
        })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.user-avatar-cover {
  overflow: hidden;
  position: absolute;
  top: 0px;
  width: 100%;
  z-index: -100;

  .user-avatar-cover_mask {
    filter: blur(8px);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 115% auto;
  }
}
.user-card {
  background-color: transparent;

  .user-panel {
    background-color: #ffffff;
    position: relative;
    text-align: center;

    .skeleton {
      height: 80px;
      margin-top: 200px;
      background: transparent;
    }

    .user-avatar {
      display: inline-block;
      height: 100px;
      width: 100px;
      box-sizing: content-box;
      border: 1px solid #ffffff;
      position: absolute;
      transform: translate(-50%, -120px);
      left: 50%;
    }
    
  }
}
</style>

