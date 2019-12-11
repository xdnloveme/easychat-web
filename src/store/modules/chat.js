import Vue from 'vue';
import Packet from '../../utils/packet';
import { createChatEvents } from '@/socket/createSyncEvents';
import router from '@/router';
import { formatTimestamp } from '@/utils/utils';

const types = {
  // 初始化
  CHAT_INIT: 'CHAT_INIT',
  // 添加聊天tips
  CHAT_ADD_TIPS: 'CHAT_ADD_TIPS',
  // 修改聊天tips
  CHAT_UPDATE_TIPS: 'CHAT_UPDATE_TIPS',
  // 初始化私聊信息
  CHAT_PRIVATE_INIT: 'CHAT_PRIVATE_INIT',
  // 私聊接收方
  CHAT_PRIVATE_RECEIVED: 'CHAT_PRIVATE_RECEIVED',
  // 发送私聊数据(以及成功回调)
  CHAT_PRIVATE_SEND: 'CHAT_PRIVATE_SEND',
  // 自己发送的消息或
  CHAT_PRIVATE_SEND_MINE: 'CHAT_PRIVATE_SEND_MINE',
  // 重发自己的消息
  CHAT_PRIVATE_RESEND_MINE: 'CHAT_PRIVATE_RESEND_MINE',
  // 添加好友请求
  CHAT_ADD_FRIEND_REQUEST: 'CHAT_ADD_FRIEND_REQUEST',
  // 接受其他好友请求
  CHAT_ADD_FRIEND_REQUEST_RECEIVED: 'CHAT_ADD_FRIEND_REQUEST_RECEIVED',
  // 获取好友请求列表
  CHAT_FRIEND_REQUEST_LIST: 'CHAT_FRIEND_REQUEST_LIST',
  // 处理好友请求
  CHAT_FRIEND_REQUEST_HANDLE: 'CHAT_FRIEND_REQUEST_HANDLE',
  // 清除chat相关的缓存数据
  CHAT_CLEAR: 'CHAT_CLEAR',
};

const state = {
  privateChat: [],
  chatServer: null,
  friendRquestList: [],
};

// 处理格式化聊天列表(添加)
const addPrivateChat = (privateChat, payload, isMine = false) => {
  const { sourcePublicInfo, targetPublicInfo } = payload;
  const privateChatList = [...privateChat];
  const privateChatFriend = privateChatList.find(
    item => item.openId === (isMine ? targetPublicInfo.openId : sourcePublicInfo.openId),
  );
  const packetModel = new Packet(payload);
  // 如果是自己发送的，则把emiting标志位置true
  const messageTemp = isMine ? packetModel.getMyMessage(true) : packetModel.getMessage();
  if (!privateChatFriend) {
    privateChatList.push({
      ...(isMine ? targetPublicInfo : sourcePublicInfo),
      record: [messageTemp],
    });
  } else {
    privateChatFriend.record.push(messageTemp);
  }
  return privateChatList;
};

const resendPrivateChat = (privateChat, payload) => {
  const { timestamp, targetPublicInfo } = payload;
  const privateChatList = [...privateChat];
  const privateChatFriend = privateChatList.find(item => item.openId === targetPublicInfo.openId);
  const packetModel = new Packet(payload);
  const messageTemp = packetModel.getMyMessage(true);
  if (privateChatFriend) {
    const recordIndex = privateChatFriend.record.findIndex(item => item.timestamp === timestamp);
    if (recordIndex > -1) {
      // privateChatFriend.record[recordIndex] = messageTemp;
      privateChatFriend.record.splice(recordIndex, 1);
      privateChatFriend.record.push(messageTemp);
    }
  }
  return privateChatList;
};

const setPrivateChatStatus = (privateChat, payload, assignment) => {
  // debugger;
  const localPrivateChat = [...privateChat];
  const { targetOpenId } = payload;
  const current = localPrivateChat.find(item => item.openId === targetOpenId);
  if (current) {
    const localRecord = [...current.record];
    let messageIndex = localRecord.findIndex(item => item.timestamp === payload.timestamp && item.isMine);
    if (messageIndex > -1) {
      localRecord[messageIndex] = {
        ...localRecord[messageIndex],
        ...assignment,
      };
    }
    current['record'] = localRecord;
  }
  return localPrivateChat;
};

// 消息发送失败
const getPrivateChatFailed = (privateChat, payload) => {
  return setPrivateChatStatus(privateChat, payload, {
    isFailed: true,
    isEmiting: false,
  });
};

// 在收到反馈后的处理
const handleMessageReceiveMine = (privateChat, payload) => {
  return setPrivateChatStatus(privateChat, payload, {
    isEmiting: false,
  });
};

// actions
const actions = {
  init (actions, chatServer) {
    const { commit } = actions;
    // Don't create another socket server
    if (!chatServer) {
      throw new Error('socket服务器还未初始化，请先初始化socket服务器');
    }
    commit('CHAT_INIT', chatServer);
    // 创建和服务器同步的事件监听
    createChatEvents(chatServer, actions);
  },
  privateMessage ({ commit }, { payload, isReSend }) {
    return new Promise((resolve, reject) => {
      if (isReSend) {
        commit('CHAT_PRIVATE_RESEND_MINE', payload);
      } else {
        commit('CHAT_PRIVATE_SEND_MINE', payload);
      }

      state.chatServer.emit('privateMessage', payload, (sendStatus, message) => {
        try {
          commit('CHAT_PRIVATE_SEND', { payload, sendStatus, message });
          resolve(sendStatus);
        } catch (e) {
          reject(e);
        }
      });
    });
  },
  addFriendRequest ({ commit, rootState }, { openId, message }) {
    const requestOpenId = rootState.publicInfo.openId;
    commit('CHAT_ADD_FRIEND_REQUEST', { openId, requestOpenId, message });
  },
  addTips ({ commit }, { message, openId, attr = {} }) {
    const payload = {
      isTip: true,
      message: message,
      ...attr,
    };
    commit('CHAT_ADD_TIPS', { payload, openId });
  },
  updateTimestamp ({ commit }, { openId }) {
    commit('CHAT_UPDATE_TIPS', openId);
  },
  handleDeleteFriend ({ state, rootState }, { openId }) {
    const requestOpenId = rootState.publicInfo.openId;
    state.chatServer.emit('deleteFriendRequest', { openId, requestOpenId }, isSend => {
      console.log('返回', isSend);
    });
  },
  handleFriendRequest ({ state }, { isAgreed, requestOption }) {
    return new Promise((resolve, reject) => {
      try {
        state.chatServer.emit('handleFriendRequest', { isAgreed, requestOption }, result => {
          const { data, code } = result;
          // 如果同意好友请求的话，更新通讯录
          if (code === 0 && isAgreed) {
            const { contactsList } = data;
            this.commit('contacts/CONTACTS_SET_LIST', contactsList);
          }

          resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  handleAddBlackListRequest ({ state }, requestOption) {
    return new Promise((resolve, reject) => {
      try {
        state.chatServer.emit('handleAddBlackListRequest', requestOption, result => {
          resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  handleRemoveFromBlackList ({ state }, requestOption) {
    return new Promise((resolve, reject) => {
      try {
        state.chatServer.emit('handleRemoveFromBlackList', requestOption, result => {
          resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  },
};

// mutations
const mutations = {
  [types.CHAT_INIT] (state, chatServer) {
    state.chatServer = chatServer;
  },
  [types.CHAT_ADD_TIPS] (state, { payload, openId }) {
    const privateChat = [...state.privateChat];
    if (!Array.isArray(openId)) {
      openId = [openId];
    }
    const current = privateChat.filter(item => openId.indexOf(item.openId) >= 0);
    if (current.length > 0) {
      current.forEach(c => {
        c.record.push(payload);
      });
    }
    state.privateChat = privateChat;
  },
  [types.CHAT_UPDATE_TIPS] (state, openId) {
    const privateChat = [...state.privateChat];
    const current = privateChat.find(item => item.openId === openId);
    if (current) {
      // 优化重绘
      let isReRender = false;
      const filterTimeStamp = current.record.filter(item => item.isTip && item.isTimestamp);
      filterTimeStamp.forEach(item => {
        if (item.message !== formatTimestamp(item.timestamp)) {
          isReRender = true;
          item.message = formatTimestamp(item.timestamp);
        }
      });

      if (isReRender) {
        state.privateChat = privateChat;
      }
    }
  },
  [types.CHAT_PRIVATE_INIT] (state, payload) {
    // 如果是数组，这里是传了一个聊天记录过来，直接拼接记录
    if (Array.isArray(payload) && payload.length >= 0) {
      payload.forEach(item => {
        if (item.sourceOpenId === this.state.publicInfo.openId) {
          const privateChat = addPrivateChat(state.privateChat, item, true);
          state.privateChat = handleMessageReceiveMine(privateChat, item);
        } else {
          // 别人发的，自己接收
          state.privateChat = addPrivateChat(state.privateChat, item);
        }
      });
    }
  },
  [types.CHAT_PRIVATE_SEND_MINE] (state, payload) {
    state.privateChat = addPrivateChat(state.privateChat, payload, true);
  },
  [types.CHAT_PRIVATE_RESEND_MINE] (state, payload) {
    state.privateChat = resendPrivateChat(state.privateChat, payload);
  },
  [types.CHAT_PRIVATE_RECEIVED] (state, payload) {
    // 3分钟
    const timerRecordCount = 3 * 60 * 1000;
    const { sourceOpenId, timestamp } = payload;

    let latestRecord = null;
    let latestMsg = null;
    const currentPrivateChat = state.privateChat.find(item => item.openId === sourceOpenId);

    if (currentPrivateChat) {
      latestRecord = [...currentPrivateChat.record];
      latestMsg = latestRecord.reverse().find(item => !item.isTip);
      if (timestamp - latestMsg.timestamp >= timerRecordCount) {
        this.dispatch('chat/addTips', {
          message: formatTimestamp(payload.timestamp),
          openId: sourceOpenId,
          attr: {
            isTimestamp: true,
            timestamp: payload.timestamp,
          },
        });
      }
    }

    if (sourceOpenId === this.state.publicInfo.openId) {
      state.privateChat = handleMessageReceiveMine(state.privateChat, payload);
    } else {
      // 别人发的，自己接收
      state.privateChat = addPrivateChat(state.privateChat, payload);

      // 如果当前页面未停留在聊天界面，则触发小红点
      const currentPath = router.history.current.path;
      if (currentPath !== '/chat') {
        const currentPathOpenId = router.history.current.query.openId || '';
        if (currentPathOpenId !== sourceOpenId) {
          this.dispatch('badge/setChatBadge', { openId: sourceOpenId, type: 'add' });
        }
      }
    }
  },
  [types.CHAT_PRIVATE_SEND] (state, { payload, sendStatus, message }) {
    if (!sendStatus) {
      // 状态为false说明发送失败
      this.dispatch('chat/addTips', {
        message,
        openId: payload.targetOpenId,
      });
      state.privateChat = getPrivateChatFailed(state.privateChat, payload);
    }
  },
  [types.CHAT_ADD_FRIEND_REQUEST] (state, { openId, requestOpenId, message }) {
    const loading = Vue.prototype.$toast({
      type: 'loading',
    });
    loading.show();
    state.chatServer.emit('addFriendRequest', { openId, requestOpenId, message }, isSend => {
      loading.destroy();
      if (isSend) {
        Vue.prototype.$toast('已成功发送好友请求，请耐心等待').toast();
      }
    });
  },
  [types.CHAT_ADD_FRIEND_REQUEST_RECEIVED] (state, payload) {
    const currentFriendRequestList = [...state.friendRquestList];
    const { requestInfo } = payload;
    const currentFriendRequest = requestInfo[0];
    const index = currentFriendRequestList.findIndex(item => {
      return item.openId === currentFriendRequest.openId && item.requestOpenId === currentFriendRequest.requestOpenId;
    });

    if (currentFriendRequest) {
      if (index >= 0) {
        currentFriendRequestList[index] = currentFriendRequest;
      } else {
        currentFriendRequestList.push(currentFriendRequest);
      }
    }
    this.dispatch('badge/setAddPeopleCount', { type: 'add' });

    state.friendRquestList = currentFriendRequestList;
  },
  [types.CHAT_FRIEND_REQUEST_LIST] (state, { list = [] }) {
    state.friendRquestList = list;
  },
  [types.CHAT_CLEAR] (state) {
    state.privateChat = [];
    state.friendRquestList = [];
    state.chatServer = null;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
