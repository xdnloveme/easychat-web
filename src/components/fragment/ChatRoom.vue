<template>
  <div class="easychat-room-wrapper">
    <Scroll ref="message" :height="heightCalc">
      <ChatRoomItem
        class="message-container"
        @avatarClick="handleAvatarClick(item)"
        @sendFailed="reSendEvent(item)"
        v-for="(item, $key) in chatList"
        :key="'room' + $key"
        :item="item"
      />
    </Scroll>
    <div :style="chattingInputStyle" class="chatting-input-wrapper">
      <textarea
        @input="handleTextareaChange"
        rows="1"
        :style="textareaStyle"
        ref="roomTextarea"
        v-model="message"
        class="chatting-textarea"
      />
      <Icon class="emoji-chatting" type="emoji" />
      <Icon class="add-chatting" type="add" />
    </div>
  </div>
</template>

<script>
import ChatRoomItem from './ChatRoomItem';
import Icon from '@/components/Icon';
import { Scroll } from 'easychat-ui';
import { isNullAll } from '@/utils/common';
import { mapActions } from 'vuex';

// 默认的textarea样式
const DEFAULT_TEXTAREA_STYLE = {
  minHeight: '26px',
  maxHeight: '100px',
  lineHeight: '18px',
};
// textarea在容器中剩余的空间
const DEFAULT_SPACE = {
  padding: '6px',
};

export default {
  name: 'ChatRoom',
  components: {
    ChatRoomItem,
    Scroll,
    Icon,
  },
  data () {
    return {
      message: '',
      textareaStyle: DEFAULT_TEXTAREA_STYLE,
      chattingInputStyle: DEFAULT_SPACE,
    };
  },
  props: {
    chatList: {
      type: Array,
      required: false,
    },
  },
  computed: {
    heightCalc () {
      const height = this.textareaStyle.height;
      const maxHeight = DEFAULT_TEXTAREA_STYLE.maxHeight;
      const space = DEFAULT_SPACE.padding;
      const minHeight = DEFAULT_TEXTAREA_STYLE.minHeight;
      const { SCREEN_HEIGHT } = this.$global;
      return SCREEN_HEIGHT - 60 - this._getCommonHeightStyle(height, maxHeight, space, minHeight);
    },
  },
  watch: {
    textareaStyle (value) {
      if (value.height === 'auto') return;
      this.$nextTick(() => {
        this.handleScrollToBottom();
      });
    },
    chatList: {
      handler (value, oldVal) {
        this.$nextTick(() => {
          const notTips = value.filter(item => !item.isTip);
          const oldNotTips = oldVal.filter(item => !item.isTip);
          try {
            if (JSON.stringify(notTips) !== JSON.stringify(oldNotTips)) {
              this.handleScrollToBottom();
            }
          } catch (e) {
            console.log(e);
          }          
        });
      },
      deep: true,
    },
  },
  mounted () {
    this.initEvent();
  },
  methods: {
    initEvent () {
      document.addEventListener('keydown', this.handleBoardKeyDown);

      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('keydown', this.handleBoardKeyDown);
      });
    },
    reSendEvent (item) {
      this.$emit('resend', item);
    },
    handleBoardKeyDown (e) {
      if (e.keyCode === 13) {
        if (!e.metaKey) {
          e.preventDefault();
          if (isNullAll(this.message)) {
            this.$toast('不能发送空白消息').toast();
            return false;
          }
          this.$emit('send', this.message);
          this.message = '';
          this.textareaStyle = DEFAULT_TEXTAREA_STYLE;
          return;
        }
        this.message += '\r\n';
        this.handleTextareaChange();
      }
    },
    // 根据输入框内容，改变输入框高度
    handleTextareaChange () {
      const el = this.$refs['roomTextarea'];
      this.textareaStyle = {
        ...DEFAULT_TEXTAREA_STYLE,
        height: 'auto',
      };
      this.$nextTick(() => {
        let height = el.scrollHeight;
        const maxHeight = this.splitFromPixel(DEFAULT_TEXTAREA_STYLE.maxHeight);
        if (height > maxHeight) height = maxHeight;
        this.textareaStyle = {
          ...DEFAULT_TEXTAREA_STYLE,
          height: `${height}px`,
        };
      });
    },
    splitFromPixel (valueStr) {
      if (valueStr && valueStr.indexOf('px') !== -1) {
        const value = valueStr.split('px')[0];
        return parseInt(value, 10);
      }
      return null;
    },
    _getCommonHeightStyle (_height, _maxHeight, _space, _minHeight) {
      const height = this.splitFromPixel(_height);
      const maxHeight = this.splitFromPixel(_maxHeight);
      const space = this.splitFromPixel(_space);
      if (height) {
        return (height >= maxHeight ? maxHeight : height) + (space + 1) * 2;
      }
      return this.splitFromPixel(_minHeight) + (space + 1) * 2;
    },
    handleAvatarClick (item) {
      this.$emit('avatarClick', item);
    },
    handleScrollToBottom () {
      if (!this.$refs['message']) {
        return;
      }
      this.$refs['message'].scrollToBottom(() => {}, false);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.message-container:first-of-type {
  padding-top: 10px;
}
.easychat-room-wrapper {
  background-color: $easychat-background;
  // padding: 10px;
  height: 100%;
  bottom: 0px;

  .message-container {
    padding-left: 10px;
    padding-right: 10px;
    &:first-of-type {
      padding-top: 10px;
    }
    &:last-of-type {
      padding-bottom: 10px;
    }
  }

  .chatting-input-wrapper {
    position: absolute;
    bottom: 0px;
    background-color: $easychat-background-light;
    left: 0;
    right: 0;
    height: auto;
    display: flex;
    padding-left: 10px;

    textarea[class='chatting-textarea'] {
      padding-left: 10px;
      border-radius: 4px;
      height: 26px;
      border-color: $easychat-border;
      border-style: solid;
      resize: none;
      overflow: hidden;
      flex: 1;
      font-size: 1em;
      line-height: 1.1;
      &:focus {
        outline: none;
      }
    }

    .emoji-chatting {
      margin-left: 10px;
    }

    .add-chatting {
      margin-left: 6px;
    }
  }
}
</style>
