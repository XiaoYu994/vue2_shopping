import request from '@/utils/request'
// 提交订单
export const orderPay = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10, // 配送方式（10快递配送 20上门自提）
    couponId: 0, // 优惠券ID
    isUsePoints: 0, // 是否使用积分抵扣（1使用 0不使用）
    payType: 10, // 支付方式 10：余额支付
    ...obj
  })
}
// 订单结算
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode,
      delivery: 10,
      couponId: 0,
      isUsePoints: 0,
      ...obj
    }
  })
}
// 订单列表
export const getOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}
// 获取订单详情
export const getOrderDetail = (orderId) => {
  return request.get('/order/detail', {
    params: {
      orderId
    }

  })
}

// 取消订单
export const cancel = (orderId) => {
  return request.post('/order/cancel', {
    orderId
  })
}

// 添加确认收货接口
export const confirmReceipt = (orderId) => {
  return request.post('/order/receipt', {
    orderId
  })
}

// 添加支付接口
export const payOrder = (orderId) => {
  return request.post('/order/pay', {
    orderId,
    payType: 10 // 余额支付
  })
}

// 添加评价接口
export const submitComment = (orderId, content, score) => {
  return request.post('/order/comment', {
    orderId,
    content,
    score
  })
}
