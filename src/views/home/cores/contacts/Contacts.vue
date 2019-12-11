<template>
  <div class="contacts-warpper">
    <div class="contacts-search">
      <span v-show="!isFocus" @click="$refs.search.focus()" class="placeholder-i">
        <img class="search-icon" :src="searchIcon" />搜索
      </span>
      <input
        v-model="searchValue"
        ref="search"
        @focus="isFocus = true"
        @blur="isFocus = false"
        class="contacts-search-input"
      />
    </div>
    <Scroll @onScroll="onListenDictNav" :height="listHeight">
      <ContactsList
        ref="contactListComp"
        @getDictIndex="getDictIndex"
        @handleContactClick="handleContactClick"
        :filterValue="searchValue"
        :dict.sync="dictArr"
        :contacts-list="contactsListSource"
      />
    </Scroll>
    <div class="dict-nav-wrapper">
      <ul>
        <li :class="[dictIndex === $key ? 'current-dict' : '']" :key="'dict' + $key" v-for="(dict, $key) in dictArr">
          {{ dict }}
        </li>
      </ul>
    </div>
    <div v-show="dictIndex >= 0" class="dict-nav-header">
      {{ dictArr[dictIndex] }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import pinyin from 'pinyin';
import search from '@/assets/icon/search.svg';
import ContactsList from './contacts_list';
import Scroll from '@/components/Scroll';

export default {
  name: 'contacts',
  components: {
    ContactsList,
    Scroll,
  },
  computed: {
    ...mapState({
      publicInfo: state => state.publicInfo,
      contactsList: state => state.contacts.contactsList,
      addPeopleCount: state => state.badge.addPeopleCount,
    }),
    listHeight () {
      const { SCREEN_HEIGHT } = this.$global;
      return SCREEN_HEIGHT - 122 - 46;
    },
    contactsListSource () {
      return this.getContactsList(this.getDictAndSort(this.contactsList));
    },
  },
  data () {
    return {
      searchIcon: search,
      isFocus: false,
      dictionary: {},
      options: {
        isTabbarShow: true,
        // 节流，间隔100ms
        throttle: 100,
      },
      searchValue: '',
      list: [],
      dictArr: [],
      dictIndex: -1,
    };
  },
  activated () {
    this.eachInit();
  },
  watch: {
    addPeopleCount (val) {
      this.$store.commit('nav/SET_NAV_RIGHT', {
        badge: val,
      });
    },
  },
  methods: {
    eachInit () {
      this.$store.commit('nav/SET_NAV_RIGHT', {
        icon: 'addpeople',
        badge: this.addPeopleCount,
        operate: () => {
          this.$router.push({
            name: 'AddPeople',
          });
        },
      });
    },
    onListenDictNav (e) {
      // 主动调用子组件方法
      this.$refs.contactListComp.setDictNav();
    },
    getContactsList (dict) {
      const cl = [];
      Object.keys(dict).forEach((key, $index) => {
        // 排列字母表对应范围内的条目
        dict[key].sort((a, b) => pinyin.compare(a.name, b.name));
        const l = dict[key].map(item => ({ name: item.name, ...item }));
        cl.push({
          key: key,
          list: l,
        });
      });
      // 根据字母排序
      return cl.sort((a, b) => a.key.localeCompare(b.key));
    },
    // 获取通讯录目录字典
    getDictAndSort (list) {
      const dict = {};
      for (let i in list) {
        let first_letter;
        const current = list[i].name;
        const f_w = current.substring(0, 1);

        if (this._isContainsEn(f_w)) {
          first_letter = current.substring(0, 1);
        } else if (this._isCN(f_w)) {
          first_letter = pinyin(current, {
            style: pinyin.STYLE_FIRST_LETTER,
          });
        } else {
          // 其他默认分类#
          first_letter = ['#'];
        }

        // 获取字符数组的首字符(大写)作为排序依据，
        first_letter = first_letter[0][0].toLocaleUpperCase();
        // 如果字典对象属性不存在，则新建数组
        if (!dict[first_letter]) {
          dict[first_letter] = [];
        }

        dict[first_letter].push({
          name: list[i].name,
          data: list[i],
        });
      }

      return dict;
    },
    getDictIndex (index) {
      this.dictIndex = index;
    },
    handleContactClick (item) {
      this.$router.push({
        name: 'UserCard',
        params: {
          userInfo: encodeURI(JSON.stringify(item.data)),
        },
      });
    },
    // 是否含有英文
    _isContainsEn (str) {
      return /[A-Za-z]+/.test(str);
    },
    // 是否含有中文
    _isCN (str) {
      return /[\u4E00-\u9FA5]+/.test(str);
    },
  },
};
</script>

<style lang="scss" scoped>
.contacts-warpper {
  .contacts-search {
    background-color: $easychat-background-light;
    padding: 8px;
    position: relative;

    .placeholder-i {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: $easychat-font-light;
      font-size: 0.9em;
      z-index: 0;

      .search-icon {
        height: 20px;
        width: 20px;
        vertical-align: bottom;
      }
    }

    .contacts-search-input {
      border: 1px solid $easychat-border-light;
      width: 100%;
      border-radius: 4px;
      line-height: 28px;
      padding: 0 10px;
      background: #ffffff;
    }

    .contacts-search-input:focus {
      outline: none;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(221, 221, 221, 0.6);
    }
  }

  .dict-nav-wrapper {
    position: absolute;
    right: 8px;
    font-size: 0.75em;
    top: 50%;
    transform: translateY(-50%);

    ul {
      list-style: none;
      padding-left: 0px;

      li {
        transform: scale(0.8);
        color: $easychat-font-dark;
        width: 14.5px;
        height: 14.5px;
        line-height: 14.5px;
        text-align: center;
      }

      .current-dict {
        color: #ffffff;
        border: 1px solid $easychat-primary-color;
        background-color: $easychat-primary-color;
        border-radius: 100%;
      }
    }
  }
}
</style>
