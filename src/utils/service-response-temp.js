/**
 * {
 *  state: 状态,
 *  message: 传递的信息,
 *  data: 传递的数据
 * }
 */

export class Success {
  typeof = 'success'

  constructor ({ message, data = null, code = 0}) {
    this.message = message;
    this.state = true;
    this.data = data;
    this.code = code;
  }

  setData (data) {
    this.data = data;
  }
}

/**
 * {
 *  state: 状态,
 *  message: 传递的信息,
 *  data: 传递的数据
 * }
 * 以下为service层返回controller层的数据模板
 */

export class CustomError {
  typeof = 'error'

  constructor ({ message, code = 1, data = {} }) {
    this.code = code;
    this.message = message;
    this.state = false;
    this.data = data;
  }

  setData (data) {
    this.data = data;
  }
}