<template>
  <div class="mine-info-edit-wrapper">
    <Drawer :isShowHeader="false" :isFullScreen="true" v-model="nicknameModifiedVisiable">
      <div class="nickname-edit">
        <div class="nickname-edit-nav">
          <span @click="nicknameModifiedVisiable = false" class="left">取消</span>
          <span class="title">修改昵称</span>
          <span
            @click="handleConfirmEdit"
            :class="['right', isAllowNickNameConfirm ? 'confirm-allowed' : 'confirm-banned']"
            >确定</span
          >
        </div>
        <div class="edit-input">
          <FormBased borderStyle="normal" placeholder="请输入昵称" v-model="nicknameModified" />
        </div>
      </div>
    </Drawer>
    <PickerArea
      @confirm="handleAreaConfirm"
      :selected.sync="addressEdit"
      :visible.sync="areaModifiedVisiable"
    />
    <ChatListCell
      @click="handleCellClick(item)"
      :key="item.name + $key"
      :options="item"
      v-for="(item, $key) in list"
    >
    </ChatListCell>
    <ActionSheet @onSelect="handleSexSelect" :list="sexList" :visible.sync="sexVisible" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Drawer, PickerArea, ActionSheet } from 'easychat-ui';
import ChatListCell from '@/components/fragment/ChatListCell';
import FormBased from '@/components/fragment/FormBased';

const INIT_LIST = [
  {
    id: 'avatar',
    name: '头像',
    to: '/mine/edit',
    rightIcon: null,
  },
  {
    id: 'nickname',
    name: '昵称',
    desc: null,
  },
  {
    id: 'district',
    name: '地区',
    desc: null,
  },
  {
    id: 'sex',
    name: '性别',
    desc: null,
    format (value) {
      switch (value) {
        case 1:
          return '男';
        case 0:
          return '女';
        case -1:
          return '保密';
        default:
          return '保密';
      }
    },
  },
];

const sexOptions = [
  {
    name: '男',
    key: 1,
  },
  {
    name: '女',
    key: 0,
  },
  {
    name: '保密',
    key: -1,
  },
];

export default {
  name: 'MineInfoEdit',
  components: {
    FormBased,
    PickerArea,
    ChatListCell,
    ActionSheet,
    Drawer,
  },
  computed: {
    ...mapState({
      nickname: ({ publicInfo }) => publicInfo.nickname,
      openId: ({ publicInfo }) => publicInfo.openId,
      signature: ({ publicInfo }) =>
        publicInfo.signature ? publicInfo.signature : '这个人很懒，什么都没有写。',
      avatar: ({ publicInfo }) => publicInfo.avatar,
      district: ({ publicInfo }) => publicInfo.district,
      sex: ({ publicInfo }) => publicInfo.sex,
    }),
    list () {
      return [...INIT_LIST].map(item => {
        let merge = {};
        if (item.rightIcon !== undefined) {
          merge = {
            rightIcon: this.avatar,
          };
        }
        if (item.desc !== undefined) {
          let value = this[item.id];
          if (item.format && typeof item.format === 'function') {
            value = item.format(this[item.id]);
          }
          merge = {
            desc: value,
          };
        }
        return {
          ...item,
          ...merge,
        };
      });
    },
    isAllowNickNameConfirm () {
      return this.nicknameModified !== this.nickname;
    },
    sexList () {
      return sexOptions.map(item => {
        if (item.key === this.sex) {
          return {
            ...item,
            isSelected: true,
          };
        }
        return item;
      });
    },
  },
  data () {
    return {
      nicknameModifiedVisiable: false,
      nicknameModified: '',
      areaModifiedVisiable: false,
      sexVisible: false,
      modalOptions: {
        fullScreen: true,
        animation: {
          name: 'translate-vertical',
        },
        style: {
          backgroundColor: '#fafafb',
        },
      },
      addressEdit: [],
      sexOptions,
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapActions({
      modifyPublicInfo: 'modifyPublicInfo',
    }),
    init () {
      this.nicknameModified = this.nickname;
    },
    handleCellClick ({ id }) {
      switch (id) {
        case 'nickname':
          this.modifyNickname();
          break;
        case 'openId':
          // this.$router.push('/test');
          break;
        case 'district':
          this.modifyArea();
          break;
        case 'avatar':
          this.$router.push('/avatar');
          break;
        case 'sex':
          this.modifySex();
          break;
        default:
          return;
      }
    },
    modifySex () {
      this.sexVisible = true;
    },
    modifyNickname () {
      this.nicknameModifiedVisiable = !this.nicknameModifiedVisiable;
    },
    modifyArea () {
      this.areaModifiedVisiable = !this.areaModifiedVisiable;
    },
    async handlePublicInfoModify (attr) {
      const loading = this.$toast({
        type: 'loading',
        message: '正在修改',
      });
      loading.show();
      const res = await this.modifyPublicInfo(attr);
      loading.destroy();
    },
    handleConfirmEdit () {
      if (!this.isAllowNickNameConfirm) return;
      const updateNickName = {
        nickname: this.nicknameModified,
      };
      this.handlePublicInfoModify(updateNickName).then(res => {
        this.nicknameModifiedVisiable = false;
      });
    },
    handleAreaConfirm (value) {
      const updateArea = {
        district: value,
      };
      this.handlePublicInfoModify(updateArea).then(res => {
        this.areaModifiedVisiable = false;
      });
    },
    handleSexSelect (item) {
      const { key } = item;
      const updateSex = {
        sex: key,
      };
      this.handlePublicInfoModify(updateSex).then(res => {
        this.sexVisible = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.nickname-edit {
  .edit-input {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
  }

  .nickname-edit-nav {
    height: $easychat-nav-height;
    background-color: $easychat-background-nav;
    display: flex;
    color: #ffffff;
    align-items: center;
    font-size: 1.05em;
    padding-left: 10px;
    padding-right: 10px;
    .left {
      width: 25%;
      text-align: left;
    }
    .right {
      width: 25%;
      text-align: right;
    }

    .confirm-allowed {
      color: $easychat-primary-color;
    }

    .confirm-banned {
      color: $easychat-primary-color;
      opacity: 0.4;
    }

    .title {
      flex: 1;
      text-align: center;
      font-size: 1.22em;
    }
  }
}
</style>

