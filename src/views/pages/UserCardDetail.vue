<template>
  <div class="user-info-warpper">
    <div class="user-info-detail">
      <div class="detail-nickname">
        <span>{{ userInfo.nickname }}</span>
      </div>
      <div class="detail-signature">
        <span>{{ userInfo.signature }}</span>
      </div>

      <div class="detail-body">
        <div v-if="isShowRequest && !isFriend" class="info-request-message">
          <span v-if="typeof requestMessage === 'string'">{{
            `${userInfo.nickname}: ${requestMessage}`
          }}</span>
          <p
            v-else
            class="request-message"
            v-for="(message, $key) in requestMessage"
            :key="`rMessage${$key}`"
          >
            {{ `${userInfo.nickname}: ${message}` }}
          </p>
        </div>
        <div v-else class="info-list">
          <Divider />
          <p class="info-list-item">
            <span>简聊号</span>
            <span>{{ userInfo.openId }}</span>
          </p>
          <p class="info-list-item">
            <span>地区</span>
            <span>{{ userInfo.district || '未知' }}</span>
          </p>
        </div>
      </div>
      <template v-if="isFriend">
        <div style="padding: 0 32px;">
          <Button @click="handleGoChat()">发消息</Button>
        </div>
      </template>
      <template v-else>
        <div style="padding: 0 32px;" class="user-info-operate">
          <Button @click="isShowRequest ? handleAgreeRequest() : handleAddRequest()">{{
            isShowRequest ? '通过验证' : '添加好友'
          }}</Button>
        </div>
        <div v-if="isShowRequest" style="padding: 0 32px;" class="user-info-operate">
          <Button :hasBorder="true" type="default" @click="handleAddBlackList">{{
            this.requestOption.isAddBlackList ? '从黑名单中移除' : '加入黑名单'
          }}</Button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Divider from '@/components/Divider';
import Button from '@/components/Button';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'UserCardDetail',
  components: {
    Divider,
    Button,
  },
  props: {
    isShowRequest: {
      type: Boolean,
      default: false,
    },
    isFriend: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  computed: {
    ...mapState({
      friendRquestList: state => state.chat.friendRquestList,
    }),
    requestMessage () {
      const message = this.requestOption.message || [];
      if (typeof message === 'string') {
        return message;
      }
      return message.reverse();
    },
    requestOption () {
      const currentRequestOption = this.friendRquestList.find(
        item => item.requestOpenId === this.userInfo.openId,
      );
      if (currentRequestOption) {
        return currentRequestOption;
      }
      return [];
    },
  },
  methods: {
    ...mapActions({
      handleFriendRequest: 'chat/handleFriendRequest',
      handleRemoveFromBlackList: 'chat/handleRemoveFromBlackList',
      handleAddBlackListRequest: 'chat/handleAddBlackListRequest',
    }),
    ...mapMutations({
      CONTACTS_SET_LIST: 'contacts/CONTACTS_SET_LIST',
    }),
    handleAgreeRequest () {
      // 同意好友
      this.handleFriendRequest({
        isAgreed: true,
        requestOption: this.requestOption,
      }).then(res => {
        if (!res.state) {
          this.$confirm({
            title: '添加好友失败',
            content: res.message,
            type: 'error',
            onConfirm: () => {
              this.handleAddRequest();
            },
          });
        }
      });
    },
    // 去请求
    handleAddRequest () {
      const openId = this.userInfo.openId;
      this.$router.push({
        path: '/addPeopleRequest',
        query: {
          openId,
        },
      });
    },
    // 拉黑
    handleAddBlackList () {
      const { isAddBlackList } = this.requestOption;
      if (isAddBlackList) {
        this.handleRemoveFromBlackList(this.requestOption).then(res => {
          this.$toast(res.message).toast();
        });
        return;
      }
      // 加入黑名单
      this.handleAddBlackListRequest(this.requestOption).then(res => {
        this.$toast(res.message).toast();
      });
    },
    // 去聊天
    handleGoChat () {
      const { openId, nickname } = this.userInfo;
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

<style lang="scss" scoped>
.user-info-warpper {
  background-color: #ffffff;
  .user-info-detail {
    .detail-nickname {
      font-size: 1.1em;
      color: $easychat-font-dark;
      font-weight: 500;
      margin-bottom: 6px;
    }

    .detail-signature {
      font-size: 0.9em;
      color: $easychat-font-light;
    }

    .detail-body {
      .info-request-message {
        min-height: 60px;
        margin-bottom: 30px;
        background-color: $easychat-background;
        margin-top: 20px;
        border-top: 1px solid $easychat-border-dark;
        border-bottom: 1px solid $easychat-border-dark;
        padding-top: 15px;
        padding-left: 20px;
        padding-bottom: 15px;
        text-align: left;
        font-size: 0.8em;
        color: $easychat-font;
        max-height: 160px;
        overflow: auto;

        .request-message {
          margin-bottom: 6px;
          margin-top: 0px;
        }
      }

      .info-list-item:first-of-type {
        margin-top: 30px;
      }

      .info-list {
        padding-left: 30px;
        padding-right: 30px;
        // margin-top: 30px;
        margin-bottom: 30px;
        .info-list-item {
          text-align: left;
          font-size: 0.9em;
          color: $easychat-font-dark;
          margin-bottom: 8px;
          span {
            &:first-child {
              width: 25%;
              color: $easychat-font-light;
              display: inline-block;
            }
          }
        }
      }
    }

    .user-info-operate {
      padding-left: 30px;
      padding-right: 30px;
      margin-bottom: 10px;
    }
  }
}
</style>
