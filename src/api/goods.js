import request from '@/utils/request'
// 获取搜索商品的数据
export const getGoodsList = (obj) => {
  // const { categoryId, goodsName, page, sortType, sortPrice } = obj
  return request.get('/goods/list', {
    params: {
      ...obj
    }
  })
}

// 获取商品详情
export const getGoodsDetail = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

// 获取商品保障服务
export const getGoodsService = (goodsId) => {
  return request.get('/goods.service/list', {
    params: {
      goodsId
    }
  })
}
