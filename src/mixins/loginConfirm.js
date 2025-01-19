export default {
  methods: {
    loginConfirm () {
      // 对用户登录状态进行判断
      if (!this.$store.getters.token) {
        // 提醒用户登录
        this.$dialog.confirm({
          title: '温馨提示',
          message: '还没登录呢蠢货',
          confirmButtonText: '去登陆',
          cancelButtonText: '再逛逛'
        })
        // 确定逻辑
          .then(() => {
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          // 取消逻辑
          .catch(() => {
            // on cancel
          })
        return true
      }
      return false
    }
  }
}
