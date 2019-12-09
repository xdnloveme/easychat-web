import user from '@/service/user';

const types = {
  INIT: 'INIT',
  // 设置通讯录列表
  CONTACTS_SET_LIST: 'CONTACTS_SET_LIST',
};

const state = {
  contactsList: [],
};

const getters = {};

// actions
const actions = {
  async init (context) {
    const {
      data: { contactsList },
    } = await user.getContactsData(this.state.publicInfo.openId);
    context.commit('CONTACTS_SET_LIST', contactsList);
  },
};

// mutations
const mutations = {
  [types.CONTACTS_SET_LIST] (state, contactsList) {
    console.log('----', contactsList);
    state.contactsList = contactsList.map(item => ({
      ...item.userInfo,
      isFriend: true,
      name: item.userInfo.nickname,
    }));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
