import { isEqualObj } from '@/utils/common';
import { createSquareEvents } from '@/socket/createSyncEvents';

const types = {
  // 初始化
  SQUARE_INIT: 'SQUARE_INIT',
  // 加入广场
  SQUARE_JOIN: 'SQUARE_JOIN',
  // 加入广场的回复
  SQUARE_JOIN_REPLY: 'SQUARE_JOIN_REPLY',
  // 离开广场
  SQUARE_LEAVE: 'SQUARE_LEAVE',
  // 离开广场的回复
  SQUARE_LEAVE_REPLY: 'SQUARE_LEAVE_REPLY',
  // 发送消息
  SQUARE_SEND_MESSAGE: 'SQUARE_SEND_MESSAGE',
  // 收到消息
  SQUARE_SEND_MESSAGE_REPLY: 'SQUARE_SEND_MESSAGE_REPLY',
  // 有人加入广场的广播
  SQUARE_JOIN_BROADCAST: 'SQUARE_JOIN_BROADCAST',
  // 有人离开广场的广播
  SQUARE_LEAVE_BROADCAST: 'SQUARE_LEAVE_BROADCAST',
  // 向聊天框增加tips（提示语）非聊天内容
  SQUARE_ADD_TIPS: 'SQUARE_ADD_TIPS',
  // 从聊天列表移除某一个条目(只移除第一个匹配的)
  SQUARE_REMOVE_FROM_CHAT: 'SQUARE_REMOVE_FROM_CHAT',
};

const state = {
  chatServer: null,
  chatList: [],
  userCounts: 0,
  memberInfo: {},
};

let clearSquareEvents = null;

// actions
const actions = {
  init (context, chatServer) {
    const { rootState } = context;
    // Don't create another socket server
    if (!rootState.chatServer || !chatServer) {
      return;
    }
    console.log('触发初始化', chatServer, rootState);
    context.commit('SQUARE_INIT', chatServer);
  },
  sendMessage (context, payload) {
    context.commit('SQUARE_SEND_MESSAGE', payload);
  },
  join (context) {
    const { commit, state, rootState } = context;
    clearSquareEvents = createSquareEvents(state.chatServer, context);
    commit('SQUARE_JOIN', rootState.publicInfo);
  },
  leave (context) {
    context.commit('SQUARE_LEAVE');
  },
  addTips (context, payload) {
    context.commit('SQUARE_ADD_TIPS', payload);
  },
  remove (context, current) {
    context.commit('SQUARE_REMOVE_FROM_CHAT', current);
  },
};

// mutations
const mutations = {
  [types.SQUARE_INIT] (state, chatServer) {
    state.chatServer = chatServer;
  },
  [types.SQUARE_JOIN] (state, publicInfo) {
    state.chatServer.emit('join', publicInfo);
  },
  [types.SQUARE_JOIN_REPLY] (state, memberInfo) {
    const socket_id = memberInfo.socketId;
    state.socket_id = socket_id;
    state.memberInfo = memberInfo;
  },
  [types.SQUARE_LEAVE_REPLY] (state, message) {
    console.log(message);
  },
  [types.SQUARE_LEAVE_BROADCAST] (state, { userCounts }) {
    state.userCounts = userCounts;
    this.dispatch('nav/setNavInfo', {
      title: `广场（${userCounts}人在线）`,
    });
  },
  [types.SQUARE_SEND_MESSAGE_REPLY] (state, payload) {
    const chatList = [...state.chatList];
    const { publicInfo } = this.state;
    const { openId } = publicInfo;
    const isMine = payload.sourceOpenId === openId;
    // 如果是自己发送的
    if (isMine) {
      const current = chatList.find(item => item.timestamp === payload.timestamp);
      if (current) {
        current.isEmiting = false;
      }
    } else {
      payload.isMine = false;
      payload.isEmiting = false;
      chatList.push(payload);
    }
    state.chatList = chatList;
  },
  [types.SQUARE_SEND_MESSAGE] (state, payload) {
    payload = payload.getMyMessage(true);
    state.chatList.push(payload);
    state.chatServer.emit('sendMessage', state.socket_id, payload);
  },
  [types.SQUARE_JOIN_BROADCAST] (state, { userCounts }) {
    if (!state.chatServer) return;
    state.userCounts = userCounts;
    this.dispatch('nav/setNavInfo', {
      title: `广场（${userCounts}人在线）`,
    });
  },
  [types.SQUARE_ADD_TIPS] (state, payload) {
    state.chatList.push(payload);
  },
  [types.SQUARE_REMOVE_FROM_CHAT] (state, current) {
    const index = state.chatList.findIndex(item => {
      return isEqualObj(item, current);
    });
    if (index === -1) return;
    state.chatList.splice(index, 1);
  },
  // 离开房间
  [types.SQUARE_LEAVE] (state) {
    state.chatServer.emit('leave', state.memberInfo, res => {
      if (clearSquareEvents) {
        // 触发销毁
        clearSquareEvents();
      }
    });

    // state.chatServer = null;
    state.socket_id = null;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
