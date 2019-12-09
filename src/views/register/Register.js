import validation from '@/utils/validation';
import registerService from '@/service/register';
import FormVerify from '@/components/fragment/FormVerify';

export default {
  name: 'Register',
  components: {
    FormVerify,
  },
  data () {
    return {
      hidden: {
        visibility: 'hidden',
      },
      currentWindow: {},
      currentIndex: 0,
      validate_map: [
        {
          content: [
            {
              id: 'username',
              validate: function () {
                return validation.usernameValidate(this.value);
              },
            },
          ],
        },
        {
          content: [
            {
              id: 'password',
              validate: function () {
                return validation.passwordValidate(this.value);
              },
            },
            {
              id: 'password-repeat',
              // 是否与当前vm对象绑定，改变了this指向vm，使用的时候请注意
              isBindVm: true,
              validate: function () {
                let passwordValidate = validation.passwordValidate(this.step_list[1].content[1].value);
                let isPasswordEqual = validation.mustEqual(
                  this.step_list[1].content[1].value,
                  this.step_list[1].content[0].value,
                );
                // 重新制定新的混合规则消息
                let res = validation.mixinRules('两次密码输入必须相等', passwordValidate, isPasswordEqual);
                return res;
              },
            },
          ],
        },
        {
          content: [
            {
              id: 'nickname',
              validate: function () {
                return {
                  state: true,
                  message: '通过',
                };
              },
            },
            {
              id: 'sex',
              validate: function () {
                return {
                  state: true,
                  message: '通过',
                };
              },
            },
          ],
        },
        {
          content: [
            {
              id: 'email',
              validate: function () {
                return validation.emailValidate(this.value);
              },
            },
          ],
        },
      ],
      step_list: [
        {
          title: '请填写登录的用户名',
          msgBtnErr: '用户名不符合规范',
          content: [
            {
              id: 'username',
              placeHold: '请输入注册的用户名（长度不超过16）',
              value: '',
              type: 'text',
              validateFun: null,
              showVeryify: false,
            },
          ],
        },
        {
          title: '请填写登录的密码',
          msgBtnErr: '密码不符合格式或两次输入不一致',
          content: [
            {
              id: 'password',
              placeHold: '请输入登录密码',
              value: '',
              type: 'password',
              validateFun: null,
            },
            {
              id: 'password-repeat',
              placeHold: '请第二次输入登录密码',
              value: '',
              type: 'password',
              validateFun: null,
            },
          ],
        },
        {
          title: '请填写个人信息（昵称、性别）',
          msgBtnErr: '',
          content: [
            {
              id: 'nickname',
              placeHold: '请输入您的昵称',
              value: '',
              type: 'text',
              validateFun: null,
            },
            {
              id: 'sex',
              placeHold: '',
              value: 0,
              propsData: {
                title: '您的性别',
                radioBox: [{ id: 'male', value: 1, desc: '男' }, { id: 'female', value: 0, desc: '女' }],
              },
              type: 'radio',
              validateFun: null,
            },
          ],
        },
        {
          title: '请填写您的的邮箱',
          msgBtnErr: '邮箱格式不正确，请重新输入',
          content: [
            {
              id: 'email',
              placeHold: '请输入您的注册邮箱',
              value: '',
              type: 'text',
              validateFun: null,
            },
          ],
        },
      ],
      test: null,
    };
  },
  computed: {
    veryify () {
      return this.setVeryify();
    },
  },
  created () {
    this.initStepValidate();
    this.initDebounce();
  },
  methods: {
    initStepValidate () {
      for (let i in this.validate_map) {
        for (let j = 0; j < this.validate_map[i].content.length; j++) {
          var _validateMap = this.validate_map[i].content[j];
          if (_validateMap.isBindVm) {
            _validateMap.validate = _validateMap.validate.bind(this);
          }
          this.step_list[i].content[j].validateFun = _validateMap.validate;
        }
      }
    },
    initDebounce () {
      const _currentStep = this.step_list[0].content[0];
      const _currentStepMap = this.validate_map[0].content[0];
      _currentStep['debounce'] = {
        duration: {
          time: 800,
          message: '正在验证...',
        },
        start: () => {
          _currentStep.showVeryify = false;
          _currentStep.validateFun = _currentStepMap.validate;
          let result = _currentStep.validateFun();
          if (!result.state) {
            _currentStep.showVeryify = true;
            return false;
          }
          _currentStep.validateFun = function () {
            return {
              message: '正在验证...',
              state: false,
            };
          };
        },
        process: async () => {
          let value = _currentStep.value;
          const _result = await registerService.isUsernameCanRegister(value);
          if (!_result.state || !_result.data.isCanRegister) {
            _currentStep.showVeryify = true;
            _currentStep.validateFun = function () {
              return {
                message: _result.message,
                state: false,
              };
            };
            return;
          }
          _currentStep.validateFun = _currentStepMap.validate;
        },
      };
    },
    setVeryify () {
      var _arr = [];
      for (var i = 0; i < this.step_list.length; i++) {
        let arr = [];
        for (var j = 0; j < this.step_list[i].content.length; j++) {
          var _current = this.step_list[i].content[j];
          if (!_current.validateFun) {
            throw new Error(
              `您的步骤中id为"${_current.id}"的配置中有规则函数未定义，请在validate_map数据中填写您的规则函数`,
            );
          }
          arr.push({
            ..._current.validateFun(),
          });
        }
        _arr.push({
          nextState: this.isNext(arr),
          veryifyData: arr,
        });
      }
      return _arr;
    },
    isNext (arr) {
      let flag = true;
      for (var i = 0; i < arr.length; i++) {
        if (!arr[i].state) {
          flag = false;
        }
      }
      return flag;
    },
    nextStep (isNext, step) {
      if (step.nextAsyncFun) {
        step.nextAsyncFun(step);
      }

      if (!isNext) {
        this.$toast(step.msgBtnErr).toast();
        return;
      }

      if (this.currentIndex === this.step_list.length - 1) {
        return;
      }

      this.currentIndex += 1;
      this.currentWindow = {
        transform: `translateX(-${this.currentIndex}00%)`,
      };
    },
    // 提交整个注册的数据
    submit (allStep, $step, data) {
      for (let i in allStep) {
        if (!allStep[i].nextState) {
          this.$toast($step.msgBtnErr).toast();
          return;
        }
      }
      this.submitProcess(data);
    },
    submitProcess (_data) {
      const _self = this;
      let concat_data = [];
      _data.forEach((element, index) => {
        concat_data = concat_data.concat(element.content);
      });
      const username = this.getValueByListId('username', concat_data);
      const password = this.getValueByListId('password', concat_data);
      const email = this.getValueByListId('email', concat_data);
      const nickname = this.getValueByListId('nickname', concat_data) || '测试昵称';
      const sex = this.getValueByListId('sex', concat_data);
      const data = registerService.submit({
        username,
        password,
        email,
        nickname,
        sex,
      });
      const submitT = this.$toast({
        type: 'loading',
      });
      submitT.show();
      data
        .then(_res => {
          submitT.destroy();
          _self.$toast(_res.message).toast();
          console.log('成功提交了', _res);
          if (_res.data.isRegisterSuccess) {
            _self.$router.push({ name: 'registerResult', params: { isSuccess: _res.state } });
          }
        })
        .catch(e => {
          submitT.destroy();
          _self.$toast(e.message).toast();
        });
    },
    getValueByListId (id, list = []) {
      const result = list.find(item => item.id === id);
      if (!result) {
        throw new Error('找不到对应步骤的id，请确认值是否正确，且只支持第一层遍历，不支持深度遍历');
      }
      return result.value;
    },
    preStep () {
      if (this.currentIndex === 0) {
        return;
      }
      this.currentIndex -= 1;
      this.currentWindow = {
        transform: `translateX(-${this.currentIndex}00%)`,
      };
    },
  },
};
