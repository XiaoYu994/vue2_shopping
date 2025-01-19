import request from '@/utils/request'

// 获取商品评价
export const getComments = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit: 3 // 默认展示3条
    }
  })
}
