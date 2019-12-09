<template>
  <div class="loading-c">
    <div class="loading-spinning">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div><br/>
      <div class="dot dot-3"></div>
      <div class="dot dot-4"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script>

export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
    }
  },
}
</script>

<style scoped lang="scss">
.loading-text {
  margin: 0;
  margin-top: 6px;
  font-size: .92em;
  color: #696969;
}

.loading-spinning {
  display: inline-block;

  .dot {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    margin: 2px 5px;
  }

  .dot-1 {
    background-color: #ebf2fc;
    animation: dot1 1.2s linear infinite;
  }

  .dot-2 {
    background-color: #b5d2f3;
    animation: dot2 1.2s linear infinite;
  }

  .dot-3 {
    background-color: #7eb0ea;
    animation: dot3 1.2s linear infinite;
  }

  .dot-4 {
    background-color: #4b90e2;
    animation: dot4 1.2s linear infinite;
  }
}


@keyframes dot4 {
  0% { background-color: #ebf2fc; }
  25% { background-color: #b5d2f3; }
  50% { background-color: #4b90e2; }
  75% { background-color: #7eb0ea; }
  100% { background-color: #ebf2fc; }
}

@keyframes dot3 {
  0% { background-color: #b5d2f3; }
  25% { background-color: #4b90e2; }
  50% { background-color: #7eb0ea; }
  75% { background-color: #ebf2fc; }
  100% { background-color: #b5d2f3; }
}

@keyframes dot2 {
  0% { background-color: #7eb0ea; }
  25% { background-color: #ebf2fc; }
  50% { background-color: #b5d2f3; }
  75% { background-color: #4b90e2; }
  100% { background-color: #7eb0ea; }
}

@keyframes dot1 {
  0% { background-color: #4b90e2; }
  25% { background-color: #7eb0ea; }
  50% { background-color: #ebf2fc; }
  75% { background-color: #b5d2f3; }
  100% { background-color: #4b90e2; }
}

</style>

