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
