<template>
  <Modal @handleAfterHidden="handleAfterLeave" v-model="visible">
    <template v-slot:header>
      <div class="easychat-confirm-hedaer"><Icon :class="iconClass" :size="24" :type="iconType" /> {{ title }}</div>
    </template>
    <template v-slot:body>
      <p class="easychat-confirm-body">{{ content }}</p>
    </template>
    <template v-slot:footer>
      <div class="easychat-confirm-footer">
        <a href="javascript:;" @click="cancel" class="confirm-btn"><Button size="large" type="default">取消</Button></a>
        <a href="javascript:;" @click="confirm" class="confirm-btn"
          ><Button style="border-radius: 0px;" size="large" :type="type" :textColor="textColor">确认</Button></a
        >
      </div>
    </template>
  </Modal>
</template>

<script>
import { Modal, Button } from 'easychat-ui';
import Icon from '@/components/Icon';

export default {
  name: 'Confirm',
  components: {
    Modal,
    Button,
    Icon,
  },
  data () {
    return {
      // 控制显示
      visible: false,
      // 标题
      title: '这是一个确认框',
      // 内容
      content: '我是描述的内容',
      // 点击确认框的操作
      onConfirm: null,
      // 点击取消的操作
      onCancel: null,
      // 确认框类型
      type: 'default',
    };
  },
  mounted () {
    this.visible = true;
  },
  computed: {
    textColor () {
      switch (this.type) {
        case 'default':
          return '#4485f5';
        default:
          return '#4485f5';
      }
    },
    iconClass () {
      if (this.type === 'default') {
        return `icon-question`
      }
      return `icon-${this.type}`
    },
    iconType () {
      switch (this.type) {
        case 'default':
          return 'question';
        case 'error':
          return 'error';
        default:
          return 'question';
      }
    },
  },
  methods: {
    cancel () {
      this.visible = false;
      if (this.onCancel && typeof this.onCancel === 'function') {
        this.onCancel.call(this);
      }
    },
    confirm () {
      if (this.onConfirm && typeof this.onConfirm === 'function') {
        let isCloseModal = this.onConfirm();
        if (isCloseModal === undefined) {
          isCloseModal = true;
        }

        if (isCloseModal === true) {
          this.visible = false;
        }
      } else {
        this.visible = false;
      }
    },
    handleAfterLeave () {
      // 记得动画隐藏后销毁
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
  },
};
</script>

<style lang="scss" scoped>
.easychat-confirm-body {
  margin: 0;
}

.icon-question {
  color: #fe4a4a;
}

.easychat-confirm-footer {
  display: flex;

  .confirm-btn {
    flex: 0.5;
    text-decoration: none;
    -webkit-user-select: none;
    -moz-user-focus: none;
    -moz-user-select: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }

  .confirm-btn:active {
    outline: none;
    background-color: #fafafa;
  }

  .confirm-btn:first-child {
    border-right: 1px solid #eee;
  }
}
</style>
