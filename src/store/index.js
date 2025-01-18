import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 全局状态
    loading: false
  },
  getters: {
    // 获取user模块下的token
    token: state => {
      return state.user.userInfo?.token || ''
    }
  },
  mutations: {
    // 提供该变全局状态的方法
    setLoading (state, status) {
      state.loading = status
    }
  },
  actions: {
  },
  modules: {
    user
  }
})
