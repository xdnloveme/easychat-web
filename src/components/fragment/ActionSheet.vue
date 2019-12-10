<template>
  <Drawer :drawerStyle="currentStyle" v-model="localVisible" :isShowHeader="false">
    <ul class="action-select-ul">
      <li
        :class="['action-select-li', item.isSelected ? 'action-selected' : '']"
        @click="select(item)"
        v-for="(item, $key) in list"
        :key="'popupSelect' + $key"
      >
        <a href="javascript:;">{{ item.name }}</a>
      </li>
      <li class="action-select-li-cancel" @click="cancel">
        <a href="javascript:;">取消</a>
      </li>
    </ul>
  </Drawer>
</template>

<script>
import Drawer from '@/components/Drawer';

export default {
  name: 'PopupSelect',
  components: {
    Drawer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default () {
        return [];
      },
    },
  },
  data () {
    return {
      localVisible: false,
      currentStyle: { height: 'auto', minHeight: 'auto' },
    };
  },
  watch: {
    visible (value) {
      this.localVisible = value;
    },
    localVisible (value) {
      /**
       * visible.sync 是否显示
       */
      this.$emit('update:visible', value);
    },
  },
  mounted () {
    this.localVisible = this.visible;
  },
  methods: {
    cancel () {
      this.localVisible = false;
    },
    select (item) {
      this.$emit('onSelect', item);
    },
  },
};
</script>

<style lang="scss">
.action-select-ul {
  margin: 0;
  padding: 0px;
  li {
    list-style: none;
    line-height: 48px;
    text-align: center;

    a {
      text-decoration: none;
      color: #222222;
      display: block;
      &:active {
        background-color: $easychat-background;
      }
    }
  }

  .action-select-li {
    border-bottom: 1px solid $easychat-border;
    margin: 0 12px;
  }

  .action-selected {
    a {
      color: #f4333c;
    }
  }

  .action-select-li-cancel {
    line-height: 60px;
  }
}
</style>
