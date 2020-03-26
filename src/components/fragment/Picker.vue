<template>
  <div class="easychat-picker-container" :style="containerStyle">
    <p :style="cellSelectStyle" class="picker-item-select"></p>
    <div class="easychat-picker-scroll-container">
      <div
        :style="scrollItemStyle"
        v-for="(item, $key) in filterData"
        :key="$key + 'picker'"
        class="easychat-picker-scroll-item"
      >
        <div class="scroll-item-wrapper">
          <Scroll
            :options="scrollOptions"
            ref="scroll"
            @onScroll="handleScroll"
            @scroll-end="handlerScrollEnd($event, $key)"
            @scroll-animate-intercept="handleIntercept($event, $key)"
            :height="height"
          >
            <div :style="maskStyle" slot="mask" class="scroll-item-mask"></div>
            <div ref="pickerScroll" :style="pickerScrollStyle" class="easychat-picker-scroll">
              <div :style="cellStyle" class="picker-item" v-for="(_item, _key) in item" :key="_key + 'pickerItem'">
                {{ _item.name }}
              </div>
            </div>
          </Scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Scroll } from 'easychat-ui';

const DEFAULT_CELL_HEIGHT = 30;

const DEFAULT_DATA = ['默认值'];

const DEFAULT_OPTIONS = {
  // 背景色
  bgColor: '#ffffff',
  // 选中条的背景色
  selectedBgColor: '#ffffff',
  // 遮罩渐变背景色
  maskGradientColor: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.6)'],
  // 初始化的条目选择下标(传入必须是个数组 [0, 0 ,0 ] )
  initSelectedIndex: null,
};

export default {
  name: 'Picker',
  components: {
    Scroll,
  },
  computed: {
    pickerScrollStyle () {
      return {
        paddingTop: `${(this.height - this.cellHeight) / 2}px`,
        paddingBottom: `${(this.height - this.cellHeight) / 2}px`,
      };
    },
    cellStyle () {
      return this.cellHeight === DEFAULT_CELL_HEIGHT
        ? {}
        : {
            height: `${this.cellHeight}px`,
            lineHeight: `${this.cellHeight}px`,
          };
    },
    cellSelectStyle () {
      const { selectedBgColor } = this.localOptions;
      return {
        height: `${this.cellHeight}px`,
        lineHeight: `${this.cellHeight}px`,
        backgroundColor: selectedBgColor,
      };
    },
    maskStyle () {
      const defaultMaskStyle = {
        backgroundSize: `100% calc(50% - ${this.cellHeight / 2}px)`,
      };
      if (!this.options['maskGradientColor']) {
        return defaultMaskStyle;
      }
      const { maskGradientColor } = this.localOptions;
      if (maskGradientColor.length === 1 || maskGradientColor[0].indexOf('rgba') !== -1) {
        console.warn('please input correct Gradient Color ("rgba" expected)');
      }
      return {
        ...defaultMaskStyle,
        backgroundImage: `linear-gradient(to bottom, ${maskGradientColor[0]}, ${maskGradientColor[1]}),
          linear-gradient(to top, ${maskGradientColor[1]}, ${maskGradientColor[0]})`,
      };
    },
    scrollItemStyle () {
      const count = this.filterData.length;
      return {
        width: `${(1 / count) * 100}%`,
      };
    },
    containerStyle () {
      const { bgColor } = this.localOptions;
      return {
        backgroundColor: bgColor,
      };
    },
    localData () {
      if (!Array.isArray(this.dataSource[0])) {
        return [[...this._formatData(this.dataSource)]];
      }
      return this.dataSource.map(item => {
        return this._formatData(item);
      });
    },
    localOptions () {
      return {
        ...DEFAULT_OPTIONS,
        ...this.options,
      };
    },
  },
  watch: {
    dataSource () {
      if (this.generatorAsyncInit) {
        let status = this.generatorAsyncInit.next();
        while (!status.done) {
          status = this.generatorAsyncInit.next();
        }
        // 及时销毁
        this.generatorAsyncInit = null;
      }
    },
  },
  props: {
    height: {
      props: Number,
      default: 500,
    },
    cellHeight: {
      type: Number,
      default: DEFAULT_CELL_HEIGHT,
    },
    dataSource: {
      type: Array,
      required: true,
      default () {
        return DEFAULT_DATA;
      },
    },
    selected: {
      type: Array,
      default () {
        return [];
      },
    },
    options: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      expectItemIndex: 0,
      expectItemIndexGroup: [],
      filterData: DEFAULT_DATA,
      measure: 0,
      prevScrollTop: null,
      scrollTop: null,
      isOnScrollAnimating: false,
      scrollOptions: {
        interceptVelocityY: 1.5,
        scrollToDuration: 375,
      },
    };
  },
  mounted () {
    // 数据为空则启动构造器异步初始化流程，等待数据传入初始化
    if (this.dataSource.length == 0 || !this.dataSource) {
      this.generatorAsyncInit = this.asyncInit();
    } else {
      this.init();
    }
  },
  beforeDestroy () {
    if (this.generatorAsyncInit) {
      this.generatorAsyncInit = null;
    }
  },
  methods: {
    init () {
      // 初始化下标
      const initSelectedIndex = [
        ...this.localData.map((item, index) => {
          if (this.options['initSelectedIndex'] && Array.isArray(this.options['initSelectedIndex'])) {
            return this.options['initSelectedIndex'][index] || 0;
          }
          return 0;
        }),
      ];
      this.expectItemIndexGroup = initSelectedIndex;

      this.localData.forEach((item, index) => {
        this.handleFilterData(index, initSelectedIndex[index]);
        // 初始化默认是0
        this.emitUpdateSelectedValue(index, initSelectedIndex[index]);
      });

      // 滚动到初始化下标的位置
      if (initSelectedIndex.some(i => i !== 0)) {
        this.$nextTick(() => {
          initSelectedIndex.forEach((expectItemIndex, index) => {
            const instance = this.$refs['scroll'][index];
            const cellHeight = this.cellHeight || DEFAULT_CELL_HEIGHT;
            instance.scrollTo(-(expectItemIndex * cellHeight), () => {
              this.emitUpdateSelectedValue(index, expectItemIndex);
            });
          });
        });
      }
    },
    *asyncInit () {
      yield this.init();
      return '初始化完成';
    },
    handlerScrollEnd (scrollTop, index) {
      this.handlePositionAdjust(scrollTop, index);
    },
    handleIntercept (scrollTop, index) {
      this.handlePositionAdjust(scrollTop, index);
    },
    handlePositionAdjust (scrollTop, index) {
      const instance = this.$refs['scroll'][index];

      // 判断是否超出边界
      if (instance.isOutOfRange) {
        this.handleOutOfRangeSelectedValue(index);
        return;
      }

      const cellHeight = this.cellHeight || DEFAULT_CELL_HEIGHT;
      const expectItemIndex = this._getPositionAdjust(cellHeight, scrollTop);

      instance.scrollTo(-(expectItemIndex * cellHeight), () => {
        this.emitUpdateSelectedValue(index, expectItemIndex);
      });
    },
    handleChange (index, expectItemIndex) {
      // 联动数据的过滤逻辑
      this.handleFilterData(index, expectItemIndex);

      const selectedValue = this.expectItemIndexGroup.map((_item, _index) => {
        if (_item >= this.filterData[_index].length) {
          console.error('此下标超出了数据源数组的长度，请确认');
        }
        const current = this.filterData[_index][_item];
        if (!current) {
          console.error('此下标的数据对象未定义，请确认');
        }
        if (current.value && current.value !== '') {
          return current;
        } else {
          return current.value || current.name;
        }
      });
      /**
       * on change 事件
       */
      this.$emit('on-change', selectedValue);

      return selectedValue;
    },
    // 联动逻辑
    handleFilterData (index, expectItemIndex) {
      const expectItemIndexGroup = this.expectItemIndexGroup;
      expectItemIndexGroup[index] = expectItemIndex;

      let _filterData = this.filterData === DEFAULT_DATA ? [...this.localData] : this.filterData;

      for (let i = index; i < this.localData.length; i++) {
        if (i + 1 < this.localData.length) {
          const current = this.localData[i];
          const next = this.localData[i + 1];
          const filterItem = next.filter((_item, _$index) => {
            const currentFilterData = _filterData[i];
            if (_item['mapKey'] && currentFilterData[expectItemIndexGroup[i]]['key']) {
              const instance = this.$refs['scroll'][i + 1];
              if (instance) {
                instance.scrollToTop(() => {}, false);
              }
              expectItemIndexGroup[i + 1] = 0;
              return _item['mapKey'] === currentFilterData[expectItemIndexGroup[i]]['key'];
            }
            return true;
          });

          _filterData[i + 1] = filterItem;
        }
      }

      this.expectItemIndexGroup = [...expectItemIndexGroup];

      this.filterData = [..._filterData];
    },
    handleScroll (scrollTop) {
      if (!this.prevScrollTop) {
        return (this.prevScrollTop = scrollTop);
      }
      const measure = scrollTop - this.prevScrollTop;
      this.scrollTop = scrollTop;
      this.prevScrollTop = scrollTop;
      this.measure = measure;
    },
    handleOutOfRangeSelectedValue (index) {
      if (this.scrollTop >= 0) {
        // 大于0说明超出上边界
        this.emitUpdateSelectedValue(index, 0);
      } else {
        // 小于0说明超过下边界
        this.emitUpdateSelectedValue(index, this.filterData[index].length - 1);
      }
    },
    // 同步更新
    emitUpdateSelectedValue (index, expectItemIndex) {
      const selectedValue = this.handleChange(index, expectItemIndex);
      /**
       * selected.sync
       */
      this.$emit('update:selected', [...selectedValue]);
    },
    _formatData (data) {
      return data.map(item => {
        if (typeof item === 'string') {
          return {
            name: item,
          };
        }
        return item;
      });
    },
    // 调整落点坐标
    _getPositionAdjust (cellHeight, scrollTop) {
      const measure = this.measure;
      if (measure > 0) {
        return Math.floor(Math.abs(scrollTop / cellHeight));
      } else if (measure < 0) {
        return Math.ceil(Math.abs(scrollTop / cellHeight));
      } else {
        return Math.round(Math.abs(scrollTop / cellHeight));
      }
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

