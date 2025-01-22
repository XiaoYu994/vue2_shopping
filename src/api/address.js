import request from '@/utils/request'
// 获取收货地址
export const getAddRessList = () => {
  return request.get('/address/list')
}
// 获取默认收货地址
export const getDefault = () => {
  return request.get('/address/defaultId')
}
// 设置默认地址
export const setDefault = (addressId) => {
  return request.post('/address/setDefault', {
    address_id: addressId
  })
}

// 编辑收货地址
export const updataAddress = (addressId, obj) => {
  return request.post('/address/edit', {
    address_id: addressId,
    form: {
      ...obj
    }
  })
}

// 新增地址
export const addAddress = (data) => {
  return request.post('/address/add', {
    form: data
  })
}

// 删除地址
export const deleteAddress = (addressId) => {
  return request.post('/address/delete', {
    addressId
  })
}
// 查询所有省市
export const getRegion = () => {
  return request.get('/region/tree')
}
