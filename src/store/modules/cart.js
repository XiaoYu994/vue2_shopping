import { getCartList, updateCart, deleteCart } from '@/api/cart'
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
    setData (state, { list, cartTotal }) {
      state.list = list
      state.cartTotal = cartTotal
    },

    changeCount (state, { goodsId, goodsNum }) {
      const goods = state.list.find(item => item.goods_id === goodsId)
      if (goods) { // 添加空值检查
        goods.goods_num = goodsNum
      }
    },

    changeChecked (state, goodsId) {
      const goods = state.list.find(item => item.goods_id === goodsId)
      if (goods) { // 添加空值检查
        goods.isChecked = !goods.isChecked
      }
    },

    changeAllChecked (state, flag) {
      state.list.forEach(item => {
        item.isChecked = flag
      })
    }
  },

  actions: {
    async getData (context) {
      try { // 添加错误处理
        const res = await getCartList()
        res.data.list.forEach(item => {
          item.isChecked = true
        })
        context.commit('setData', res.data)
      } catch (error) {
        console.error('获取购物车数据失败：', error)
        throw error
      }
    },

    async update (context, obj) {
      const { goodsId, goodsNum, goodsSkuId } = obj

      // 参数验证
      if (!goodsId || goodsNum < 1) {
        throw new Error('参数错误')
      }

      context.commit('changeCount', {
        goodsId,
        goodsNum
      })

      clearTimeout(timer)
      timer = setTimeout(async () => {
        try {
          await updateCart(goodsId, goodsNum, goodsSkuId)
        } catch (error) {
          context.commit('changeCount', {
            goodsId,
            goodsNum: goodsNum - 1
          })
          throw error
        }
      }, 1000)
    },

    async del (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      await deleteCart(cartIds)
      // 重新拉取最新的购物车数据 (重新渲染)
      context.dispatch('getData')
    }
  },

  getters: {
    isAllChecked (state) {
      return state.list.length > 0 && state.list.every(item => item.isChecked)
    },

    selCartList (state) {
      return state.list.filter(item => item.isChecked)
    },

    selCount (state, getters) {
      return getters.selCartList
        .reduce((sum, item) => sum + item.goods_num, 0)
    },

    selPrice (state, getters) {
      return getters.selCartList
        .reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_min, 0)
        .toFixed(2)
    }
  }
}
