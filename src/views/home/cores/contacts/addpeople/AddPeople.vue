<template>
  <div class="addpeople-wrapper">
    <EMask
      ref="mask"
      :backgroundColor="searchValue.length > 0 ? '#ffffff' : ''"
      :visible="visibleMask"
      @handleClose="handleClose"
    >
      <div class="search-newPeople-container">
        <div @click="$event.stopPropagation()" class="search-newPeople">
          <FormBased
            ref="addSearch"
            size="small"
            type="search"
            borderStyle="normal"
            :inputStyle="{ backgroundColor: '#eee' }"
            @search="searchPeople"
            placeholder="请输入需要搜索的用户编号"
            class="search-based-input"
            v-model="searchValue"
          />
          <span @click="handleClose" class="cancel-search">取消</span>
        </div>
        <div class="search-newPeople-result" v-show="showResult && searchValue.length > 0">
          没有找到你想找的人T^T
        </div>
      </div>
    </EMask>
    <div class="addpeople-search-container">
      <div class="copy-inputbased" @click="showMask">请输入需要搜索的用户编号</div>
    </div>
    <div class="addpeople-result">
      <div class="addpeople-result-group">
        <div class="group-title">
          <span v-if="friendRquestList.length > 0">以下为好友请求</span>
        </div>
        <ChatListCell
          v-for="(item, $key) in friendRquestList"
          :key="'request' + $key"
          @click="handleShowRequest(item)"
          class="recommend-item"
        >
          <template slot="main">
            <div class="user-add-info">
              <img class="user-avatar" :src="item.userInfo.avatar" />
              <div class="user-detail">
                <p class="nickname">{{ item.userInfo.nickname }}</p>
                <p class="easychat-id">
                  {{ typeof item.message === 'string' ? item.message : item.message[item.message.length - 1] || '' }}
                </p>
              </div>
            </div>
          </template>
          <template slot="right">
            <span v-if="item.isFinish === 1 && item.isAgreed === 1" class="user-add-desc">{{
              getStatus(item)
            }}</span>
            <span v-else class="user-add-show">查看</span>
          </template>
        </ChatListCell>
        <div class="group-title">
          <span>你可能感兴趣的人</span>
        </div>
        <ChatListCell
          v-for="(item, $key) in recommendList"
          :key="'search-result' + $key"
          @click="handleChoosePeople(item)"
          class="recommend-item"
          :options="item"
        >
          <template slot="main">
            <div class="user-add-info">
              <img class="user-avatar" :src="item.avatar" />
              <div class="user-detail">
                <p class="nickname">{{ item.nickname }}</p>
                <p class="easychat-id">{{ item.signature }}</p>
              </div>
            </div>
          </template>
        </ChatListCell>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ChatListCell from '@/components/fragment/ChatListCell';
import FormBased from '@/components/fragment/FormBased';
import EMask from '@/components/EMask';
import user from '@/service/user';

export default {
  name: 'AddPeople',
  components: {
    FormBased,
    ChatListCell,
    EMask,
  },
  data () {
    return {
      searchValue: '',
      recommendList: [],
      showResult: false,
      visibleMask: false,
    };
  },
  computed: {
    ...mapState({
      friendRquestList: state => state.chat.friendRquestList,
    }),
  },
  watch: {
    searchValue () {
      this.showResult = false;
    },
  },
  created () {
    this.getRecommendPeople();
  },
  methods: {
    getStatus ({ isFinish, isAgreed, isAddBlackList, isExpired }) {
      if (isFinish) {
        if (isExpired === 1) {
          return '已过期';
        }

        if (isAgreed === 1) {
          return '已添加';
        }
      }
    },
    searchPeople (e) {
      user.searchUser(this.searchValue).then(res => {
        if (res.data.length === 0) {
          this.showResult = true;
        } else {
          this.handleClose();
          this.goUserCard(res.data[0]);
        }
      });
    },
    getRecommendPeople () {
      user.getRecommendUsers().then(res => {
        this.recommendList = res.data;
      });
    },
    handleChoosePeople (item) {
      this.goUserCard(item);
    },
    handleShowRequest (item) {
      const { isAgreed, userInfo, requestOpenId } = item;
      this.$router.push({
        name: 'UserCard',
        params: {
          userInfo: encodeURI(
            JSON.stringify({
              ...userInfo,
              requestOpenId,
            }),
          ),
        },
      });
    },
    goUserCard (userInfo) {
      this.$router.push({
        name: 'UserCard',
        params: {
          userInfo: encodeURI(JSON.stringify(userInfo)),
        },
      });
    },
    handleClose () {
      this.visibleMask = false;
      this.showResult = false;
      this.searchValue = '';
    },
    showMask () {
      this.visibleMask = true;
      this.$nextTick(() => {
        const inputDom = this.$refs.addSearch.$refs.based;
        inputDom.focus();
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search-newPeople-container {
  .search-newPeople {
    padding: 10px;
    background: #ffffff;
    display: flex;
    align-items: center;

    .search-based-input {
      flex: 1;
    }

    .cancel-search {
      margin-left: 10px;
      color: $easychat-primary-color;
    }
  }

  .search-newPeople-result {
    text-align: center;
    margin-top: 60px;
    font-size: 1em;
    color: $easychat-font-light;
  }
}

.addpeople-wrapper {
  .addpeople-search-container {
    padding: 10px 15px;
    background-color: $easychat-background-light;

    .copy-inputbased {
      background-color: #ffffff;
      height: 28px;
      line-height: 28px;
      border: 1px solid #eee;
      border-radius: 4px;
      padding-left: 10px;
      font-size: 0.88em;
      color: $easychat-font-light;
    }

    .addpeople-search-input {
      width: 100%;
      border: 1px solid $easychat-border-light;
      height: 30px;
      line-height: 30px;
      outline: none;
      border-radius: 4px;
      padding-left: 10px;
    }
  }

  .addpeople-result {
    background-color: #ffffff;

    .addpeople-result-group {
      border-top: 1px solid $easychat-border-light;
      border-bottom: 1px solid $easychat-border-light;

      .group-title {
        background-color: $easychat-background-light;
        color: $easychat-font-light;
        border-bottom: 1px solid #eee;
        padding-left: 12px;
        padding-top: 4px;
        padding-bottom: 4px;

        span {
          font-size: 0.75em;
        }
      }

      .user-add-info {
        display: flex;
        align-items: center;
        overflow: hidden;

        .user-avatar {
          width: 30px;
          height: 30px;
        }

        .user-detail {
          margin-left: 10px;
          overflow: hidden;

          .nickname {
            margin: 0px;
            font-size: 1em;
          }

          .easychat-id {
            margin: 0px;
            font-size: 0.75em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: $easychat-font-light;
          }
        }
      }
    }

    .recommend-item /deep/ .easychat-list-cell-c-main {
      padding-top: 6px;
      padding-bottom: 6px;
    }
  }
}
.user-add-show,
.user-add-desc {
  font-size: 0.8em;
  padding: 2px 8px;
  margin-right: 10px;
}

.user-add-show {
  border: 1px solid $easychat-border;
  background-color: $easychat-background-light;
}

.user-add-desc {
  color: $easychat-font-light;
}
</style>
