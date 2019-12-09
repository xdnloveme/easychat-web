<template>
  <div class="success-c">
    <img class="success" :src="localOptions.successIcon" />
    <div class="textarea-c">
      <div class="success-title">
        <span>{{ localOptions.title }}</span>
      </div>
      <div class="desc-c">
        <p>{{ localOptions.desc }}</p>
      </div>
    </div>
    <div class="operation-c">
      <a class="operate-core-btn" @click="localOptions.button.click" href="javascript:;">{{
        localOptions.button.name
      }}</a>
      <a class="operate-assistance" @click="localOptions.assistance.click" href="javascript:;">{{
        localOptions.assistance.name
      }}</a>
    </div>
  </div>
</template>

<script>
const DEFAULT_OPTIONS = {
  successIcon: require('@/assets/icon/default/success.svg'),
  title: '操作成功',
  desc: '内容详情，可根据实际需要安排，如果换行则不超过规定长度，居中展现',
  button: {
    name: '确认提交',
  },
  assistance: {
    name: '需要帮助?',
  },
};

export default {
  name: 'Success',
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
    };
  },
  created () {
    this.init();
  },
  methods: {
    init () {},
  },
};
</script>

<style scoped>
.success-c {
  text-align: center;
  padding-top: 50px;
}

.success-title {
  font-size: 1.4em;
  font-weight: 600;
}

.desc-c {
  margin-top: 10px;
  font-size: 1em;
  color: #696969;
}

.textarea-c {
  padding: 32px;
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
  font-size: 0.9em;
  margin-top: 6px;
  color: #808080;
}
</style>

