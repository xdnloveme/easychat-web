<template>
  <div class="avatar-list-group">
    <h4>{{ title }}</h4>
    <div class="avatar-list">
      <div
        @click="handleAvatarClick(item)"
        :key="'avatar' + $key"
        v-for="(item, $key) in avatarList"
        class="avatar-item-wrapper"
      >
        <div :class="['avatar-item', item.isSelected ? 'avatar-item-selected' : 'avatar-item-unselected']">
          <img class="avatar-item-img" :src="item.imgUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvatarItem',
  props: {
    avatarList: {
      type: Array,
      required: true,
      default () {
        return [];
      },
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleAvatarClick (item) {
      this.$emit('avatarClick', item);
    },
  },
};
</script>

<style scoped lang="scss">
.avatar-list-group {
  padding-top: 40px;
  h4 {
    margin-top: 0px;
    margin-bottom: 10px;
    font-weight: 400;
    padding-left: 10px;
    border-left: 3px solid $easychat-primary-color-light;
  }
  .avatar-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .avatar-item-wrapper {
      padding: 8px;
      width: 25%;
      height: calc(25vw - 4.5px);

      &:last-child {
        margin-bottom: 60px;
      }

      .avatar-item {
        height: 100%;
        width: 100%;
        text-align: center;
        position: relative;
        border-radius: 50%;
        // border: 1px solid $easychat-border-dark;
        overflow: hidden;

        .avatar-item-img {
          width: auto;
          height: 100%;
        }
      }

      .avatar-item-unselected {
        &::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(127, 127, 127, 0.6);
          border-radius: 50%;
          left: 0px;
        }
      }
    }
  }
}
</style>

