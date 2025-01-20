import { getCartList, updateCart } from '@/api/cart'
let timer = null
export default {
  namespaced: true,
  state () {
    return {
      list: [],
      cartTotal: 0
    }
  },
  mutations: {
    // 将获取到的数据设置到vuex中
    setdata (state, { list, cartTotal }) {
      state.list = list
      state.cartTotal = cartTotal
    },
    // 更新购物车中的商品数量
    chageCount (state, { goodsId, goodsNum }) {
      const goods = state.list.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    },
    // 改变商品选中状态
    changeChecked (state, goodsId) {
      const goods = state.list.find(item => item.goods_id === goodsId)

      goods.isChecked = !goods.isChecked
    },
    // 全选反选
    changeAllChecked (state, flag) {
      state.list.forEach(item => {
        item.isChecked = flag
      })
    }
  },
  actions: {
    // 获取购物车列表数据
    async getdata (context) {
      const res = await getCartList()
      // 给购物车每个商品都添加 isChecked 属性，区分是否被选中
      res.data.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setdata', res.data)
    },
    // 更新购物车数据
    async update (context, obj) {
      const { goodsId, goodsNum, goodsSkuId } = obj
      context.commit('chageCount', {
        goodsId,
        goodsNum
      })
      // 清除之前的定时器
      clearTimeout(timer)
      // 设置新的定时器
      timer = setTimeout(async () => {
        try {
          await updateCart(goodsId, goodsNum, goodsSkuId)
        } catch (error) {
          // 更新失败，回滚数据
          context.commit('updateCartCount', {
            goodsId,
            goodsNum: goodsNum - 1
          })
          throw error
        }
      }, 1000)
    }
  },
  getters: {
    isAllchecked (state) {
      return state.list.every(item => item.isChecked)
    }
  }
}
