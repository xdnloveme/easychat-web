// 私人聊天所有的订阅事件
export const createChatEvents = (chatServer, action) => {
  const { commit, dispatch } = action;
  // 好友请求列表获取
  chatServer.on('friendRequestList-received', list => {
    commit('CHAT_FRIEND_REQUEST_LIST', {
      list,
    });
  });

  // 添加好友请求
  chatServer.on('addFriendRequest-received', payload => {
    commit('CHAT_ADD_FRIEND_REQUEST_RECEIVED', payload);
  });

  chatServer.on('privateMessage-received', payload => {
    commit('CHAT_PRIVATE_RECEIVED', payload);
  });

  chatServer.on('privateMessage-init', payload => {
    commit('CHAT_PRIVATE_INIT', payload);
    const openId = payload.map(i => {
      return i.sourceOpenId;
    });
    if (openId.length > 0) {
      dispatch('addTips', { message: '以上为最后一次记录', openId });
    }
  });
};

export const createSquareEvents = (chatServer, action) => {
  const { commit } = action;

  // 加入广场
  const joinReply = memberInfo => {
    commit('SQUARE_JOIN_REPLY', memberInfo);
  };
  chatServer.on('join-received', joinReply);

  // 离开广场
  const leaveReply = message => {
    commit('SQUARE_LEAVE_REPLY', message);
  };
  chatServer.on('leave-received', leaveReply);

  // 离开的广播
  const leaveBroadcast = payload => {
    commit('SQUARE_LEAVE_BROADCAST', payload);
  };
  chatServer.on('leave-broadcast', leaveBroadcast);

  // 发送信息的广播
  const sendMessageReply = message => {
    commit('SQUARE_SEND_MESSAGE_REPLY', message);
  };
  chatServer.on('sendMessage-received', sendMessageReply);

  // 加入的广播
  const joinBroadcast = payload => {
    commit('SQUARE_JOIN_BROADCAST', payload);
  };
  chatServer.on('join-broadcast', joinBroadcast);

  return () => {
    chatServer.off('join-received', joinReply);
    chatServer.off('leave-received', leaveReply);
    chatServer.off('leave-broadcast', leaveBroadcast);
    chatServer.off('sendMessage-received', sendMessageReply);
    chatServer.off('join-broadcast', joinBroadcast);
  };
};
