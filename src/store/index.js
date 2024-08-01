import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState  from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    userInfo: null,
    navigationDrawer: [],
    masterDrawer: [],
    groupModules: [],
    posDraftTransactions:[]
  },
  mutations: {
    STORE_USERINFO : (state , newState )=>{
      state.userInfo = newState
    },
    STORE_NAVBAR: (state, newState) => {
      state.navigationDrawer = newState
    },
    MASTER_NAVBAR: (state, newState) => {
      state.masterDrawer = newState
    },
    GROUP_MODULES: (state, newState) => {
      state.groupModules = newState
    },
    DRAFT_TRANSACTIONS:(state, newState) => {
      state.posDraftTransactions = newState
    },
  },
  actions: {
  },
  modules: {
  }
})
