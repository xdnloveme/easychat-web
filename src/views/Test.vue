<template>
  <div>
    <!-- <Scroll
      @pull-down-start="pullDownProcess"
      :pullDown="{
        height: 50,
      }"
      :pullDownLoading="flag"
      @pull-up-start="pullUpProcess"
      :pullUp="{
        height: 50,
      }"
      @onScroll="testOnScroll"
      :options="{
        debounce: {
          delay: 500,
        },
      }"
      :pullUpLoading="flag1"
      :height="500"
    >
      <p v-for="item in dataNum" :key="item">测试数据 {{ item }}</p>
    </Scroll> -->
    <!-- <Picker :height="200" v-bind:selected.sync="value" :dataSource="pickerData2"/>
    {{value}} -->

    <!-- {{pickedValue}}
    <button @click="test">测试</button>
    <PickerArea :options="{
      initSelectedIndex: [5, 0, 0]
    }" :visible.sync="visible" :selected.sync="pickedValue"/> -->

    <button @click="test1">测试1</button>
    {{ pickedValue1 }}
    <PickerDate :visible.sync="visible1" :selected.sync="pickedValue1" />
    <Success :options="options" />
  </div>
</template>

<script>
// 测试页面（仅供参考）

import Animate from '@/utils/animate';
import Picker from '@/components/fragment/Picker';
import PickerArea from '@/components/fragment/PickerArea';
import PickerDate from '@/components/fragment/PickerDate';
import Scroll from '@/components/Scroll';
import Success from '@/components/fragment/Success';

const DEFAULT_OPTIONS = {
  title: '注册成功',
  desc: '您的账号已经成功注册，请先激活您的账号，我们已经向您的邮箱发送了激活邮件，请查收。',
  button: {
    name: '现在登录',
    click: null,
  },
  assistance: {
    name: '没有收到激活邮件?',
    click: null,
  },
};

export default {
  name: 'Test',
  components: {
    // Picker,
    // PickerArea,
    PickerDate,
    Scroll,
    Success,
  },
  data () {
    return {
      visible: false,
      visible1: false,
      pickedValue: [],
      pickedValue1: [],
      dataNum: 60,
      value: [],
      flag: false,
      flag1: false,
      pickerData: [['小米', '华为', '三相', '苹果', 'iphone', 'iPhone2', '三星glax', '其他6']],
      pickerData2: [
        [
          {
            name: '小米',
            value: 1,
          },
          {
            name: '华为',
            value: 22,
          },
          {
            name: '苹果',
            value: 333,
          },
          {
            name: 'iphone',
            value: 3334,
          },
          {
            name: '小米',
            value: 1,
          },
          {
            name: '华为',
            value: 22,
          },
          {
            name: '苹果',
            value: 333,
          },
          {
            name: 'iphone',
            value: 3334,
          },
          {
            name: '哈哈哈手机',
            value: '哈哈哈',
          },
          {
            name: '3112312',
            value: '333',
          },
          {
            name: '而且',
            value: '3944',
          },
        ],
        [
          {
            name: '小米333',
            value: 1,
          },
          {
            name: '华为21213',
            value: 22334,
          },
          {
            name: '苹果2',
            value: 33344,
          },
        ],
      ],
      pickerData3: [
        [
          {
            name: '小米',
            value: 1,
          },
          {
            name: '华为',
            value: 22,
          },
          {
            name: '苹果',
            value: 333,
          },
          {
            name: 'iphone',
            value: 3334,
          },
          {
            name: '苹果水果',
            value: 333,
          },
          {
            name: 'iphone',
            value: 33345,
          },
        ],
        [
          {
            name: '小米测试数据',
            value: 1,
          },
          {
            name: '华为测试数据',
            value: 22334,
          },
          {
            name: '苹果测试数据',
            value: 33344,
          },
          {
            name: '小米1',
            value: 3,
            key: 1,
          },
          {
            name: '华为2',
            value: 3,
            key: 22,
          },
          {
            name: '苹果3',
            value: 333,
            key: 333,
          },
          {
            name: 'iphone4',
            value: 3334,
            key: 3334,
          },
        ],
      ],
      options: DEFAULT_OPTIONS,
    };
  },
  mounted () {
    // ...
    // this.test();
  },
  methods: {
    pullDownProcess () {
      this.flag = true;
      setTimeout(() => {
        this.flag = false;
      }, 2000);
    },
    testOnScroll () {
      console.log('测试');
    },
    pullUpProcess () {
      this.flag1 = true;
      setTimeout(() => {
        this.flag1 = false;
      }, 2000);
    },
    test () {
      this.visible = true;
    },
    test1 () {
      this.visible1 = true;
    },
  },
};
</script>

<style scoped lang="scss">
p {
  background-color: brown;
  color: #ffffff;
  margin-top: 0px;
}
</style>
