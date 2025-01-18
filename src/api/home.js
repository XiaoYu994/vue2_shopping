import request from '@/utils/request'

// 默认是0
export const getPageData = (pageId) => {
  return request.get('/page/detail', {
    params: {
      pageId: 0
    }
  }
  )
}
