import { getInfo } from '@/utils/localStorage'
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

  },
  actions: {

  }
}
