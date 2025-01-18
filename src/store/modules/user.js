import { getInfo, setInfo } from '@/utils/localStorage'
import { login } from '@/api/user'
export default {
  namespaced: true,
  state () {
    return {
      userInfo: getInfo()
    }
  },
  getters: {

  },
  mutations: {
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    async login ({ commit }, { phone, smsCode }) {
      const res = await login(phone, smsCode)
      commit('setUserInfo', res.data) // 确保状态更新
      return res.data // 返回数据供后续使用
    }

  }
}
