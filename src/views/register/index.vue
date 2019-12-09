<template>
  <div class="register">
    <div class="step-list">
      <div :style="currentWindow" :key="'list0' + $key" v-for="(list, $key) in step_list" class="step">
        <p class="r-t">{{ list.title }}</p>
        <FormVerify
          :key="'step0' + _$key"
          v-for="(step, _$key) in list.content"
          v-model="step.value"
          :placeholder="step.placeHold"
          :name="step.id"
          :showVeryify="step.showVeryify"
          :veryifyData="veryify[$key].veryifyData[_$key]"
          :propsData="step.propsData"
          :type="step.type"
          :debounce="step.debounce"
        />
        <div class="btn-c">
          <a
            @click="
              $key === step_list.length - 1 ? submit(veryify, list, step_list) : nextStep(veryify[$key].nextState, list)
            "
            :class="['btn', veryify[$key].nextState ? 'btn-next' : 'btn-stop']"
            href="javascript:;"
            >{{ $key === step_list.length - 1 ? '确认注册' : '下一步' }}</a
          >
          <span v-if="$key != 0" @click="preStep()" class="btn-pre">上一步</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Register.js"></script>

<style scoped>
.r-t {
  position: relative;
  font-size: 1.15em;
  color: #24292e;
  margin-bottom: 10px;
  text-align: left;
}

div.step-list {
  white-space: nowrap;
  overflow: hidden;
}

.step {
  transition: transform 0.3s ease;
  padding-left: 20px;
  padding-right: 20px;
  display: inline-block;
  vertical-align: top;
  width: 100%;
}

.step-group {
  position: relative;
  width: 100%;
}

.placeHoldSpan {
  position: absolute;
  line-height: 40px;
  padding-left: 10px;
  color: gray;
  font-size: 16px;
  z-index: -1;
}

.input-c {
  border: none;
  border-bottom: 1px solid #ddd;
  outline: none;
  height: 40px;
  font-size: 16px;
  width: 100%;
  background-color: transparent;
  padding-left: 2px;
}

.input-radio {
  height: auto;
  width: auto;
}

.input-warning {
  border-bottom-color: #ed143d;
}

.veryify-msg {
  color: #ed143d;
  font-size: 13px;
  line-height: 18px;
  padding-top: 6px;
  padding-bottom: 6px;
  text-align: left;
  white-space: normal;
}

.btn-c {
  padding-left: 40px;
  padding-right: 40px;
  margin-top: 20px;
}

.btn-stop {
  background-color: #d3d3d3;
}

.btn-next {
  /* background-color: #ff6347; */
  background-color: #338ed6;
}

.btn-pre {
  color: #6495ed;
  text-decoration: underline;
  display: block;
  margin-top: 10px;
  font-size: 0.8em;
  text-align: center;
}

.btn {
  display: block;
  color: #ffffff;
  text-decoration: none;
  padding: 6px 10px 6px 10px;
  border-radius: 4px;
  text-align: center;
}
</style>

