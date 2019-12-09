<template>
  <div class="failure-c">
    <img class="failure" :src="localOptions.icon"/>
    <div class="textarea-c">
      <div class="failure-title">
        <span>{{localOptions.title}}</span>
      </div>
      <div class="desc-c">
        <p>{{localOptions.desc}}</p>
      </div>
    </div>
    <div class="operation-c">
      <a class="operate-core-btn" @click="$emit('operate');" href="javascript:;">{{localOptions.button.name}}</a>
      <a class="operate-assistance" @click="$emit('assistance');" href="javascript:;">{{localOptions.assistance.name}}</a>
    </div>
  </div>
</template>

<script>
const DEFAULT_OPTIONS = {
  icon: require('@/assets/icon/default/refused.svg'),
  title: '操作失败',
  desc: '内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现',
  button: {
    name: '返回首页',
  },
  assistance: {
    name: '需要帮助?',
  },
}

export default {
  name: 'Failure',
  props: {
    options: {
      type: Object,
      required: false,
    },
  },
  computed: {
    localOptions () {
      return Object.assign({}, DEFAULT_OPTIONS, this.options);
    },
  },
  data () {
    return {
      defaultOption: DEFAULT_OPTIONS,
    }
  },
  created () {
    this.init();
  },
  methods: {
    init () {
    },
  },
}
</script>

<style scoped lang="scss">
.failure-c {
  text-align: center;
  padding-top: 50px;

  .textarea-c {
    padding: 32px;

    .failure-title {
      font-size: 1.4em;
      font-weight: 600;
    }

    .desc-c {
      margin-top: 10px;
      font-size: 1em;
      color: #696969;
    }
  }

  .operation-c {
    padding: 32px;
  }

  .operate-core-btn {
    background-color: #ff6347;
    display: block;
    text-decoration: none;
    color: white;
    padding: 10px 0;
    border-radius: 4px;
  }

  .operate-assistance {
    display: inline-block;
    font-size: .9em;
    margin-top: 6px;
    color: #808080;
  }
}
</style>

