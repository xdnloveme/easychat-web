import router from '@/router';

const types = {
  SET_NAV_INFO: 'SET_NAV_INFO',
  SET_NAV_RIGHT: 'SET_NAV_RIGHT',
  SET_STYLE: 'SET_STYLE',
  EACH_BEFORE: 'EACH_BEFORE',
  SET_CONFIG: 'SET_CONFIG',
  SET_NAV_TRANSPARENT: 'SET_NAV_TRANSPARENT',
};

const DEFAULT_BACKGROUND_COLOR = 'rgba(36, 41, 46, 1)';

const state = {
  currentTitle: '主页',
  config: {
    isShowBackBtn: true,
    isGobackOn: false,
  },
  rightOptions: null,
  style: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    backgroundImage: `linear-gradient(#e66465, ${DEFAULT_BACKGROUND_COLOR})`,
  },
};

const getters = {
  current () {
    return state.currentTitle;
  },
};

const formatTitle = title => {
  if (typeof title === 'function') {
    return title.apply();
  }
  return title;
};

// actions
const actions = {
  setNavInfo (context, mergeMeta) {
    const { meta } = router.currentRoute;
    const actualMeta = Object.assign({}, meta, mergeMeta);
    const { hideBackBtn } = actualMeta;
    context.commit('SET_NAV_INFO', actualMeta);
    // 每次设置都触发设置状态初始化
    const isShowBackBtnFlag = hideBackBtn ? false : true;
    context.commit('EACH_BEFORE', {
      isShowBackBtn: isShowBackBtnFlag,
    });
  },
  init (context, meta) {
    context.dispatch('setNavInfo', meta);
  },
};

// mutations
const mutations = {
  [types.SET_NAV_INFO] (state, { title = '' }) {
    state.currentTitle = formatTitle(title);
  },

  [types.SET_CONFIG] (state, config) {
    state.config = Object.assign({}, state.config, config);
  },

  [types.EACH_BEFORE] (state, config = {}) {
    // 每次变化路由都变成初始状态
    state.config = Object.assign(
      {},
      state.config,
      {
        isGobackOn: false,
      },
      config,
    );
    state.rightOptions = null;
    state.style = {
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
    };
  },

  [types.SET_NAV_RIGHT] (state, rightOptions) {
    state.rightOptions = {
      ...state.rightOptions,
      ...rightOptions,
    };
  },

  [types.SET_STYLE] (state, style) {
    state.style = Object.assign(state.style, style);
  },

  [types.SET_NAV_TRANSPARENT] (state) {
    state.style = Object.assign(state.style, {
      backgroundColor: 'rgba(36, 41, 46, 0)',
      backgroundImage: 'unset',
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
