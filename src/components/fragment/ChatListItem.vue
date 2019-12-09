<template>
  <div class="easy-chat_home_item_warpper">
    <a @click="goto" href="javascript:;" class="easy-chat_home_item">
      <div class="easy-chat_home_item_container">
        <Badge :count="info.badge">
          <img class="chat-item_user-icon" :src="info.avatar" />
        </Badge>
        <div class="easy-chat_home_item_main">
          <div class="easy-c_h_i_m_head">
            <div class="easy-c_h_i_m_h_name">
              <span>{{ info.nickname }}</span>
            </div>
            <div class="easy-c_h_i_m_h_date">
              <span>{{ info.time || '' }}</span>
            </div>
          </div>
          <div class="easy-c_h_i_m_body">
            <div class="easy-c_h_i_m_h_msg">{{ info.message }}</div>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import Badge from '@/components/Badge';

export default {
  name: 'ChatItem',
  components: {
    Badge,
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
    to: {
      type: String,
      required: false,
    },
  },
  methods: {
    goto (e) {
      if (this.to) {
        this.$router.push({
          path: this.to,
        });
      }
      this.$emit('click', e);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.easy-chat_home_item_warpper {
  background-color: #ffffff;
}

.easy-chat_home_item {
  padding-left: 12px;
  display: block;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  color: initial;
}

.easy-chat_home_item:active {
  background-color: #eeeeee;
}

.easy-chat_home_item_container {
  padding-left: 0px;
  padding-right: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 100%;
  flex: 1;
  display: flex;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.easy-chat_home_item_main {
  overflow: hidden;
  flex: 1;
  margin-left: 12px;
}

.chat-item_user-icon {
  width: 48px;
  height: 48px;
}

.easy-c_h_i_m_h_name {
  color: #333;
  font-size: 1em;
  font-weight: 500;
}

.easy-c_h_i_m_h_msg {
  color: #808080;
  margin-top: 3px;
  font-size: 0.82em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.easy-c_h_i_m_head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.easy-c_h_i_m_h_date {
  font-size: 12px;
  color: #979797;
}
</style>
