<template>
  <div class="easychat-room_item-wrapper">
    <div v-if="!localInfo.isTip" :class="['easychat-room_item', localInfo.isMine ? 'room-item-mine' : 'room-item-other']">
      <div v-show="isShowIcon" @click="iconEvent" class="center-icon">
        <Icon size="small" type="loading-spining" v-if="isShowEmit" />
        <Icon size="small" type="warning" v-if="isShowFailed" />
      </div>
      <img v-if="!localInfo.isMine" @click="avatarClick" class="avatar" :src="localInfo.avatar" />
      <div class="content">
        <div v-if="localInfo.isShowName && !localInfo.isMine" class="nickname">
          {{ localInfo.nickname }}
        </div>
        <div class="message">
          {{ localInfo.message || '' }}
        </div>
      </div>
      <img v-if="localInfo.isMine" class="avatar" :src="localInfo.avatar" />
    </div>
    <div class="easychat-room_item-tip" v-else>
      <span class="tip">
        {{ localInfo.message || 'tips' }}
      </span>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/common/Icon';

export default {
  name: 'ChatRoomItem',
  components: {
    Icon,
  },
  props: {
    item: {
      type: Object,
      required: false,
    },
  },
  computed: {
    isShowIcon () {
      return this.item.isMine && (this.item.isEmiting || this.item.isFailed);
    },
    isShowFailed () {
      return this.item.isMine && this.item.isFailed;
    },
    isShowEmit () {
      return this.item.isMine && this.item.isEmiting;
    },
    localInfo () {
      const { sourcePublicInfo } = this.item;
      // 数据扁平化
      if (sourcePublicInfo) {
        return {
          ...this.item,
          ...sourcePublicInfo,
        }
      }
      return this.item;
    },
  },
  data () {
    return {};
  },
  methods: {
    iconEvent () {
      if (this.item.isFailed) {
        this.$emit('sendFailed');
      }
    },
    avatarClick () {
      this.$emit('avatarClick');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.easychat-room_item-wrapper {
  &:last-child {
    margin-bottom: 0px;
  }
}

.easychat-room_item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;

  .center-icon {
    align-self: center;
  }

  .avatar {
    width: 44px;
    height: auto;
  }

  .content {
    .nickname {
      text-align: left;
      margin-left: 15px;
      font-size: 0.8em;
      color: $easychat-font-light;
      font-weight: 400;
      height: 14px;
      line-height: 14px;
      margin-bottom: 2px;
    }
  }

  .message {
    padding: 10px;
    border-radius: 5px;
    word-break: break-all;
    position: relative;
    font-size: 0.9em;
    min-height: 40px;
    min-width: 40px;
    // border: 1px solid #eee;
    &::after {
      border: solid transparent;
      content: '';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-width: 10px;
      top: 10px;
    }
    &::before {
      border: solid transparent;
      content: '';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-width: 12px;
      top: 8px;
    }
  }
}

.room-item-other {
  .message {
    margin-right: 54px;
    margin-left: 15px;
    background: #ffffff;
    border: 1px solid $easychat-border-dark;
    &::after {
      right: 100%;
      border-right-color: #ffffff;
    }
    &::before {
      right: 100%;
      border-right-color: $easychat-border-dark;
    }
  }
}

.room-item-mine {
  justify-content: flex-end;
  .message {
    background: $easychat-primary-color-light;
    color: #ffffff;
    margin-left: 10px;
    margin-right: 15px;
    border: 1px solid $easychat-primary-color-light;
    &::after {
      left: 100%;
      border-left-color: $easychat-primary-color-light;
    }
    &::before {
      left: 100%;
      border-left-color: $easychat-primary-color-light;
    }
  }
}

.easychat-room_item-tip {
  text-align: center;
  color: #ffffff;
  font-size: 0.75em;
  margin-bottom: 18px;
  .tip {
    padding: 2px 6px;
    border-radius: 4px;
    background-color: $easychat-background-dark;
  }
}
</style>
