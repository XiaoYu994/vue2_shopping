const INFO_KEY = 'user_info'
const SEARCH_KEY = 'search_key'

// 取出用户信息
export const getInfo = () => {
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : { token: '', user: {} }
}

// 写入用户信息
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

// 删除用户信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 搜索框历史记录存入
export const setSearch = (obj) => {
  localStorage.setItem(SEARCH_KEY, JSON.stringify(obj))
}

// 取出搜素框历史记录
export const getSearch = () => {
  const result = localStorage.getItem(SEARCH_KEY)
  return result ? JSON.parse(result) : []
}
