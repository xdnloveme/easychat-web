/**
 * @file 消息包统一结构
 * @author tangyida <530063113@qq.com>
 */
import store from '@/store';

const MESSAGE_TEMP = {
  message: '',
  isMine: false,
  isEmiting: false,
  isFailed: false,
}

export default class Packet {
  constructor ({ 
    sourcePublicInfo = store.state.publicInfo, 
    sourceOpenId = store.state.publicInfo.openId, 
    targetPublicInfo = null, 
    targetOpenId = null, 
    message = '',
    timestamp = new Date().getTime(),
    isShowName = false,
  }) {
    this.sourcePublicInfo = sourcePublicInfo;
    this.sourceOpenId = sourceOpenId;
    this.targetPublicInfo = targetPublicInfo;
    this.targetOpenId = targetOpenId;
    this.message = message;
    this.timestamp = timestamp;
    this.isShowName = isShowName;
  }

  getMessage () {
    return {
      ...MESSAGE_TEMP,
      ...this,
    }
  }

  getMyMessage (isEmiting = false) {
    return {
      ...MESSAGE_TEMP,
      ...this,
      isMine: true,
      isEmiting,
    }
  }
}