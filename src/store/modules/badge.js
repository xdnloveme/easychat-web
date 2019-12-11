const types = {
  // 小红点初始化
  INIT: 'INIT',
  // 修改聊天列表的小红点(增加)
  MODYIFY_CHAT_BADGE_ADD: 'MODYIFY_CHAT_BADGE_ADD',
  // 修改聊天列表小红点（减少）
  MODYIFY_CHAT_BADGE_REDUCE: 'MODYIFY_CHAT_BADGE_REDUCE',
  // 修改tabbar列表的小红点
  MODYIFY_TABBAR_BADGE: 'MODYIFY_TABBAR_BADGE',
  // 修改添加好友列表的小红点
  MODYIFY_ADDPEOPLE_BADGE_ADD: 'MODYIFY_ADDPEOPLE_BADGE_ADD',
  // 减少添加好友列表的小红点
  MODYIFY_ADDPEOPLE_BADGE_REDUCE: 'MODYIFY_ADDPEOPLE_BADGE_REDUCE',
};

const state = {
  chat: [],
  addPeopleCount: 0,
};

const getters = {
  tabbarCount (state) {
    const { chat, addPeopleCount } = state;
    const tabbar0Count = chat.reduce((t, current) => t + current.count, 0);
    return {
      tabbar0: tabbar0Count,
      tabbar1: addPeopleCount,
    };
  },
};

// actions
const actions = {
  setChatBadge (actions, { openId, type }) {
    const { commit } = actions;
    if (type === 'add') {
      commit('MODYIFY_CHAT_BADGE_ADD', openId);
    } else {
      commit('MODYIFY_CHAT_BADGE_REDUCE', openId);
    }
  },
  setAddPeopleCount (actions, { type }) {
    const { commit, state } = actions;
    if (type === 'add') {
      console.log('触发commit', commit);
      commit('MODYIFY_ADDPEOPLE_BADGE_ADD');
    } else if (type === 'clear') {
      commit('MODYIFY_ADDPEOPLE_BADGE_REDUCE', state.addPeopleCount);
    } else {
      commit('MODYIFY_ADDPEOPLE_BADGE_REDUCE', 1);
    }
  },
};

// mutations
const mutations = {
  [types.MODYIFY_CHAT_BADGE_ADD] (state, openId) {
    const currentChat = [...state.chat];
    const isExist = currentChat.find(item => item.openId === openId);
    if (!isExist) {
      currentChat.push({
        openId: openId,
        count: 1,
      });
    } else {
      isExist.count += 1;
    }
    state.chat = currentChat;
  },
  [types.MODYIFY_CHAT_BADGE_REDUCE] (state, openId) {
    const currentChat = [...state.chat];
    const index = currentChat.findIndex(item => item.openId === openId);
    if (index > -1) {
      currentChat.splice(index, 1);
    }
    state.chat = currentChat;
  },
  [types.MODYIFY_ADDPEOPLE_BADGE_ADD] (state) {
    state.addPeopleCount = state.addPeopleCount + 1;
  },
  [types.MODYIFY_ADDPEOPLE_BADGE_REDUCE] (state, count) {
    if (state.addPeopleCount > 0) {
      state.addPeopleCount = state.addPeopleCount - count;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
