<template>
  <div class="easychat-picker-district">
    <Drawer @confirm="handleConfirm" v-model="localVisible">
      <Picker :options="options" :height="300" :selected.sync="pickerValue" :dataSource="dataSource" />
    </Drawer>
  </div>
</template>

<script>
import Picker from './Picker';
import ProvinceAreaData from '@/assets/data/province.json';
import pinyin from 'pinyin';
import Drawer from '@/components/Drawer';

export default {
  name: 'PickerArea',
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
       * 是否显示
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
      let provinceMap = [];
      let cityMap = [];
      let areaMap = [];
      ProvinceAreaData.forEach(item => {
        const key = pinyin(item.name, {
          style: pinyin.STYLE_NORMAL,
        }).join('');
        provinceMap.push({
          name: item.name,
          value: key,
          key,
        });

        // 城市数据
        item['city'].forEach((_item, _index) => {
          const cityKey = pinyin(_item.name, {
            style: pinyin.STYLE_NORMAL,
          }).join('');

          cityMap.push({
            name: _item.name,
            value: cityKey,
            key: cityKey + _index,
            mapKey: key,
          });

          // 地区数据
          _item.area.forEach(__item => {
            const areaKey = pinyin(__item, {
              style: pinyin.STYLE_NORMAL,
            }).join('');

            areaMap.push({
              name: __item,
              value: areaKey,
              mapKey: cityKey + _index,
            });
          });
        });
      });
      this.dataSource = [provinceMap, cityMap, areaMap];
    },
    handleConfirm () {
      const name = this.pickerValue.map(item => item.name).reduce((t, v, index, arr) => t + ' ' + v);
      this.$emit('confirm', name, this.pickerValue);
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

