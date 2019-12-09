import io from 'socket.io-client';
import Vue from 'vue';
import store from '@/store';
import router from '@/router';

let server = null;

const chatRoom = () => {
  const token = store.state.token;

  // 连接chat管道
  const socketClient = io.connect(`/chat`, {
    query: `token=${token}`,
  });

  socketClient.on('error', ({ code, msg }) => {
    console.log('一般类型错误：', code, '消息', msg);
    if (code === 10007 || code === 10009) {
      setTimeout(() => {
        router.push({
          path: '/auth',
        });
      }, 300);
    }
  });

  socketClient.on('onconnect', ({ id }) => {
    console.log('create socket server/chat, set id = ' + id);
    store.commit('SOCKET_SET_SERVER_ID', id);
  });

  socketClient.on('service-error', ({ code, msg }) => {
    console.log('业务错误', code, '消息', msg);
    Vue.prototype.$toast(msg).toast();
  });

  return socketClient;
};

// 单例模式，一个用户只有一个socket客户端实例
export function createChatServer () {
  if (!server) {
    server = chatRoom.call(this);
  }
  return server;
}

export function clearChatServer () {
  if (server) {
    server = null;
  }
}
