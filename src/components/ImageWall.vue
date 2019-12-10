<template>
  <div :style="imgStyle" class="image-wall-warpper">
    <img ref="imgSource" @click="showMask" :src="imgSrc" />
    <div ref="mask">
      <EMask backgroundColor="#000000" :visible="visible" @handleClose="handleClose"></EMask>
      <transition name="image-wall-scale">
        <img
          :style="maskImgStyle"
          @click="handleClose"
          v-show="visible"
          :class="['mask-img', visible ? 'mask-img-show' : 'mask-img-hidden']"
          :src="imgSrc"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import EMask from './EMask';

export default {
  name: 'ImageWall',
  components: {
    EMask,
  },
  data () {
    return {
      visible: false,
      maskImgStyle: {},
      rate: 0,
    };
  },
  props: {
    imgSrc: {
      type: String,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 'auto',
    },
    height: {
      type: [Number, String],
      default: 'auto',
    },
  },
  mounted () {
    this.init();
  },
  beforeDestroy () {
    document.body.removeChild(this.$refs.mask);
  },
  watch: {
    visible (value) {
      this.initLocation();
      const { SCREEN_HEIGHT } = this.$global;
      const { height, top, width, left } = this.imgSrcDom.getBoundingClientRect();
      if (value) {
        setTimeout(() => {
          const top = `${SCREEN_HEIGHT / 2 - (this.rate * height) / 2}px`;
          this.setStyle({
            width: `${width * this.rate}px`,
            height: `${height * this.rate}px`,
            left: `0px`,
            top,
          });
        }, 10);
      }
    },
  },
  computed: {
    imgStyle () {
      return {
        width: this.width,
        height: this.height,
      };
    },
  },
  methods: {
    init () {
      document.body.appendChild(this.$refs.mask);
      this.imgSrcDom = this.$refs.imgSource;
      // 在路由过渡完成后
      this.$nextTransitAfter(() => {
        this.initLocation();
      });
    },
    initLocation () {
      const { SCREEN_WIDTH } = this.$global;
      const { width, height, left, top } = this.imgSrcDom.getBoundingClientRect();
      this.rate = SCREEN_WIDTH / width;
      this.setStyle({
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
      });
    },
    showMask () {
      this.visible = true;
    },
    handleClose () {
      this.visible = false;
    },
    setStyle (style = {}) {
      this.maskImgStyle = {
        ...this.maskImgStyle,
        ...style,
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.image-wall-warpper {
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }

  .image-scale-mask {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
  }
}

.mask-img {
  position: absolute;
  z-index: 1020;
}

.image-wall-scale-enter-active,
.image-wall-scale-leave-active {
  transition: all 300ms linear;
}
</style>
