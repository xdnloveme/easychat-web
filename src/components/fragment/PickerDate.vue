<template>
  <div class="easychat-picker-date">
    <Drawer v-model="localVisible">
      <Picker :options="options" :height="300" :selected.sync="pickerValue" :dataSource="dataSource" />
    </Drawer>
  </div>
</template>

<script>
import Picker from './Picker';
import pinyin from 'pinyin';
import Drawer from '@/components/Drawer';

const YEAR_START = 1920;
const YEAR_END = 2050;

const LeapCommon = ['leap', 'common'];

// 大月
const monthBigSource = [1, 3, 5, 7, 8, 10, 12];
// 小月
const monthSmallSource = [4, 6, 9, 11];
// 特殊的二月
const monthSpecialSource = [2];

export default {
  name: 'PickerDate',
  components: {
    Picker,
    Drawer,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default () {
        const now = new Date().getTime();
        const start = now - 3600 * 1000 * 24 * 365 * 20;
        const year = new Date(start).getFullYear();
        return {
          initSelectedIndex: [year - YEAR_START, 0, 0],
        };
      },
    },
  },
  data () {
    return {
      localVisible: false,
      dataSource: [],
      pickerValue: [],
    };
  },
  watch: {
    pickerValue (value) {
      /**
       * selected.sync 事件
       */
      this.$emit('update:selected', value);
    },
    localVisible (value) {
      /**
       * visible.sync 是否显示
       */
      this.$emit('update:visible', value);
    },
    visible (value) {
      this.localVisible = value;
    },
  },
  mounted () {
    this.localVisible = this.visible;
    this.init();
  },
  methods: {
    init () {
      const yearSource = this.initYears();
      const monthSource = this.initMonths();
      const daysSource = this.initDays();
      this.dataSource = [yearSource, monthSource, daysSource];
    },
    initYears () {
      let data = [];
      for (let i = YEAR_START; i < YEAR_END; i++) {
        const isLeapYear = this._isLeapYear(i);
        data.push({
          name: i,
          value: i,
          key: isLeapYear ? 'leap' : 'common',
        });
      }
      return data;
    },
    initMonths () {
      let data = [];
      ['common', 'leap'].forEach(item => {
        for (let i = 1; i <= 12; i++) {
          let key = '';
          if (monthBigSource.indexOf(i) !== -1) {
            key = `${item}big`;
          } else if (monthSmallSource.indexOf(i) !== -1) {
            key = `${item}small`;
          } else {
            key = `${item}special`;
          }
          data.push({
            name: i + '月',
            value: i,
            key,
            mapKey: item,
          });
        }
      });
      return data;
    },
    initDays () {
      const data = [];
      ['common', 'leap'].forEach(item => {
        const bigDays = 31;
        const smallDays = 30;
        const specialDays = item === 'common' ? 28 : 29;
        for (let i = 1; i <= smallDays; i++) {
          data.push({
            name: i + '日',
            value: i,
            mapKey: `${item}small`,
          });
        }
        for (let i = 1; i <= bigDays; i++) {
          data.push({
            name: i + '日',
            value: i,
            mapKey: `${item}big`,
          });
        }
        for (let i = 1; i <= specialDays; i++) {
          data.push({
            name: i + '日',
            value: i,
            mapKey: `${item}special`,
          });
        }
      });
      return data;
    },
    _isLeapYear (year) {
      return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    },
  },
};
</script>

<style scoped lang="scss">
$default-height: 30px;

.easychat-picker-container {
  // background-color: rosybrown;
  position: relative;
  .easychat-picker-scroll-container {
    display: flex;
    .easychat-picker-scroll-item {
      color: black;
      font-weight: 400;
      flex: 1;
      position: relative;

      .scroll-item-wrapper {
        position: relative;
        z-index: 3;
      }

      .scroll-item-mask {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        margin: 0 auto;
        width: 100%;
        z-index: 3;
        transform: translateZ(0px);
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6)),
          linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6));
        background-position: top, bottom;
        background-size: 100% calc(50% - 15px);
        background-repeat: no-repeat;
      }
    }
  }
}
.picker-item-select {
  position: absolute;
  width: 100%;
  margin: 0px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 1px solid $easychat-border-dark;
  border-bottom: 1px solid $easychat-border-dark;
}

.picker-item-select,
.picker-item {
  height: $default-height;
  line-height: $default-height;
  margin: 0px;
}

.easychat-picker-scroll {
  .picker-item {
    text-align: center;
  }
}
</style>

