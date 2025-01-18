import request from '@/utils/request'
// 获取搜索商品的数据
export const getGoodsList = (obj) => {
  return request.get('/goods/list', {
    params: {
      ...obj
    }
  })
}