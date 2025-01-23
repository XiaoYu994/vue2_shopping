import request from '@/utils/request'

// 获取图片验证码
export const getImgCode = () => {
  return request.get('/captcha/image')
}

// 获取短信验证码
export const getCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    captchaCode,
    captchaKey,
    mobile
  })
}

// 手机验证登录
export const login = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false,
      mobile,
      partyData: {},
      smsCode
    }
  })
}

// 获取个人信息
export const getUserInfoDetail = () => {
  return request.get('/user/info')
}

// 上传头像
export const uploadAvatar = (file) => {
  console.log(file)

  return request.post('/upload/image', {
    file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
