<template>
  <div ref="contacts_list" class="contacts_list-warpper">
    <div :class="['contacts-group']" :key="'group' + $key" v-for="(group, $key) in localContactsList">
      <div class="group-key">
        <span>{{ group.key }}</span>
      </div>
      <ChatListCell
        @click="handleContactClick(item)"
        :key="'contacts' + _$key"
        class="contacts-main"
        :options="{
          ...item,
          hideRightArrow: true,
        }"
        v-for="(item, _$key) in group.list"
      >
        <template v-slot:main>
          <div class="contacts-list-main">
            <img class="contacts-list-avatar" :src="item.data.avatar" />
            <div class="contacts-name">{{ item.name }}</div>
          </div>
        </template>
      </ChatListCell>
    </div>
  </div>
</template>

<script>
import ChatListCell from '@/components/fragment/ChatListCell';

export default {
  name: 'contacts_list',
  components: {
    ChatListCell,
  },
  props: {
    contactsList: {
      type: Array,
    },
    filterValue: {
      type: String,
    },
  },
  data () {
    return {
      groupNode: [],
      currentNodeIndex: -1,
    };
  },
  watch: {
    currentDictIndex (value) {
      this.$emit('getDictIndex', value);
    },
  },
  computed: {
    currentDictIndex () {
      return this.currentNodeIndex - 1;
    },
    localContactsList () {
      const contactsMap = this.contactsList.map(item => {
        const list = item.list.filter(
          $item => $item.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1,
        );
        return {
          ...item,
          list,
        };
      });
      const filterList = contactsMap.filter(item => item.list && item.list.length > 0);
      this.$emit('update:dict', filterList.map(item => item.key).sort((a, b) => a.localeCompare(b)));
      // 简单过滤
      return filterList;
    },
  },
  // 每次进入页面都进行强制的更新（激活）
  activated () {
    this.setDictNav();
  },
  methods: {
    // 必须在$nextTick调用
    getGroupNode () {
      return Array.prototype.filter.call(
        this.$refs.contacts_list.children,
        item => item.className === 'contacts-group',
      );
    },
    setDictNav () {
      this.$nextTick(() => {
        const groupNode = this.getGroupNode();
        const currentNodeIndex = Array.prototype.findIndex.call(groupNode, (item, index) => {
          const cr = item.getBoundingClientRect();
          return (cr.y || cr.top) - 60 > 0;
        });

        this.currentNodeIndex = currentNodeIndex;
      });
    },
    handleContactClick (item) {
      this.$emit('handleContactClick', item);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// 深入穿透class，可选right && main
.contacts-main /deep/ .easychat-list-cell-c-main {
  padding-top: 6px;
  padding-bottom: 6px;
}

.contacts_list-warpper {
  .contacts-group {
    .group-key {
      padding-left: 12px;
      padding-top: 3px;
      padding-bottom: 3px;
      color: $easychat-font-light;
      font-size: 0.75em;
      background-color: $easychat-background-light;
    }
  }

  .dict-nav-header {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    border-bottom: 1px solid $easychat-border-light;
    background-color: #ffffff;
    font-size: 0.75em;
    padding-left: 12px;
    padding-top: 3px;
    padding-bottom: 3px;
    color: $easychat-primary-color;
  }
}

.contacts-list-main {
  display: flex;
  align-items: center;

  .contacts-list-avatar {
    width: 32px;
    height: 32px;
  }

  .contacts-name {
    font-size: 0.9em;
    margin-left: 10px;
  }
}
</style>
