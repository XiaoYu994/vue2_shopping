<template>
  <div class="user">
    <div class="head-page" v-if="isLogin">
      <div class="head-img" @click="$refs.fileInput.click()">
        <img :src="detail.avatar || require('@/assets/default-avatar.png')" alt="" />
        <!-- 隐藏的文件输入框 -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onFileChange"
        >
      </div>
      <div class="info">
        <div class="mobile">{{ detail.mobile }}</div>
        <div class="vip">
          <van-icon name="diamond-o" />
          普通会员
        </div>
      </div>
    </div>

    <div v-else class="head-page" @click="$router.push('/login')">
      <div class="head-img">
        <img src="@/assets/default-avatar.png" alt="" />
      </div>
      <div class="info">
        <div class="mobile">未登录</div>
        <div class="words">点击登录账号</div>
      </div>
    </div>

    <div class="my-asset">
      <div class="asset-left">
        <div class="asset-left-item">
          <span>{{ detail.pay_money || 0 }}</span>
          <span>账户余额</span>
        </div>
        <div class="asset-left-item">
          <span>0</span>
          <span>积分</span>
        </div>
        <div class="asset-left-item">
          <span>0</span>
          <span>优惠券</span>
        </div>
      </div>
      <div class="asset-right">
        <div class="asset-right-item">
          <van-icon name="balance-pay" />
          <span>我的钱包</span>
        </div>
      </div>
    </div>

    <div class="order-navbar">
      <div class="order-navbar-item" @click="$router.push('/order?dataType=all')">
        <van-icon name="balance-list-o" />
        <span>全部订单</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/order?dataType=payment')">
        <van-icon name="clock-o" />
        <span>待支付</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/order?dataType=delivery')">
        <van-icon name="logistics" />
        <span>待发货</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/order?dataType=received')">
        <van-icon name="send-gift-o" />
        <span>待收货</span>
      </div>
    </div>

    <div class="service">
      <div class="title">我的服务</div>
      <div class="content">
        <div class="content-item" @click="goAddress">
          <van-icon name="records" />
          <span>收货地址</span>
        </div>
        <div class="content-item">
          <van-icon name="gift-o" />
          <span>领券中心</span>
        </div>
        <div class="content-item">
          <van-icon name="gift-card-o" />
          <span>优惠券</span>
        </div>
        <div class="content-item">
          <van-icon name="question-o" />
          <span>我的帮助</span>
        </div>
        <div class="content-item">
          <van-icon name="balance-o" />
          <span>我的积分</span>
        </div>
        <div class="content-item">
          <van-icon name="refund-o" />
          <span>退换/售后</span>
        </div>
      </div>
    </div>

    <div class="logout-btn" v-if="isLogin">
      <button @click="logout">退出登录</button>
    </div>

    <!-- 图片裁剪弹窗 -->
    <van-popup v-model="showCropper" position="bottom" :style="{ height: '100%' }">
      <van-nav-bar
        title="图片裁剪"
        left-text="取消"
        right-text="确定"
        @click-left="showCropper = false"
        @click-right="onCropperConfirm"
      />
      <vue-cropper
        ref="cropper"
        :img="cropperImage"
        :info="true"
        :auto-crop="true"
        :fixed="true"
        :fixed-number="[1, 1]"
        :center-box="true"
        :high="true"
        img-style="width: 100%; height: 100%;"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserInfoDetail, uploadAvatar } from '@/api/user.js'

import loginConfirm from '@/mixins/loginConfirm'
// 修改引入方式
import { VueCropper } from 'vue-cropper'

export default {
  name: 'UserPage',

  components: {
    VueCropper
  },

  mixins: [loginConfirm],

  data () {
    return {
      detail: {},
      showCropper: false,
      cropperImage: '',
      // 添加裁剪配置
      cropperOptions: {
        img: '', // 裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        fixedBox: true, // 固定截图框大小
        fixedNumber: [1, 1], // 截图框比例
        centerBox: true, // 截图框是否被限制在图片里面
        high: true // 是否按照设备的dpr 输出等比例图片
      }
    }
  },

  created () {
    if (this.isLogin) {
      this.getUserInfoDetail()
    }
  },

  computed: {
    isLogin () {
      return this.$store.getters.token
    }
  },

  methods: {
    async getUserInfoDetail () {
      const { data: { userInfo } } = await getUserInfoDetail()
      this.detail = userInfo
    },

    // 文件选择处理
    onFileChange (e) {
      if (!this.isLogin) {
        this.$toast('请先登录')
        return
      }

      const file = e.target.files[0]
      if (!file) return

      // 检查文件类型
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        this.$toast('请上传 jpg/png/gif 格式的图片')
        return
      }

      // 检查文件大小（2MB）
      if (file.size > 2 * 1024 * 1024) {
        this.$toast('图片大小不能超过 2MB')
        return
      }

      // 读取文件并显示裁剪器
      const reader = new FileReader()

      reader.onload = (event) => {
        this.cropperImage = event.target.result
        this.showCropper = true
      }
      reader.readAsDataURL(file)
      console.log(reader)

      // 清空 input 的值，允许选择相同文件
      e.target.value = ''
    },

    // 裁剪确认
    async onCropperConfirm () {
      if (!this.$refs.cropper) return

      try {
        this.$toast.loading({
          message: '上传中...',
          forbidClick: true,
          duration: 0
        })

        // 获取裁剪后的图片 base64 数据
        const base64Data = await new Promise(resolve => {
          this.$refs.cropper.getCropData(data => {
            resolve(data)
          })
        })

        // 将 base64 转换为 Blob
        const blob = await fetch(base64Data).then(r => r.blob())

        // 创建 FormData 对象并添加文件
        const formData = new FormData()
        formData.append('file', blob, 'avatar.jpg')

        // 上传文件
        // 打印检查 FormData 内容
        for (const [key, value] of formData.entries()) {
          console.log('FormData 内容:', key, value)
        }
        // TODO formData对象为空
        const { data } = await uploadAvatar(formData)

        // 更新头像
        this.detail.avatar = data.url
        // 更新 Vuex 中的用户信息
        this.$store.commit('user/updateAvatar', data.url)

        this.$toast.success('上传成功')
        this.showCropper = false
      } catch (error) {
        console.error('上传失败：', error)
        this.$toast.fail('上传失败：' + (error.response?.data?.message || '未知错误'))
      } finally {
        this.$toast.clear()
      }
    },

    logout () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '你确认要退出么？'
      })
        .then(() => {
          this.$store.dispatch('user/logout')
        })
        .catch(() => {})
    },

    goAddress () {
      if (this.loginConfirm()) return
      this.$router.push('/address')
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 50px;
}

.head-page {
  height: 130px;
  background: url("http://cba.itlike.com/public/mweb/static/background/user-header2.png");
  background-size: cover;
  display: flex;
  align-items: center;

  .head-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 10px;
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: '点击修改头像';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover::after {
      opacity: 1;
    }
  }
}

.info {
  .mobile {
    margin-bottom: 5px;
    color: #c59a46;
    font-size: 18px;
    font-weight: bold;
  }
  .vip {
    display: inline-block;
    background-color: #3c3c3c;
    padding: 3px 5px;
    border-radius: 5px;
    color: #e0d3b6;
    font-size: 14px;
    .van-icon {
      font-weight: bold;
      color: #ffb632;
    }
  }
}

.my-asset {
  display: flex;
  padding: 20px 0;
  font-size: 14px;
  background-color: #fff;
  .asset-left {
    display: flex;
    justify-content: space-evenly;
    flex: 3;
    .asset-left-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span:first-child {
        margin-bottom: 5px;
        color: #ff0000;
        font-size: 16px;
      }
    }
  }
  .asset-right {
    flex: 1;
    .asset-right-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }
    }
  }
}

.order-navbar {
  display: flex;
  padding: 15px 0;
  margin: 10px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 5px;
  .order-navbar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 25%;
    .van-icon {
      font-size: 24px;
      margin-bottom: 5px;
    }
  }
}

.service {
  font-size: 14px;
  background-color: #fff;
  border-radius: 5px;
  margin: 10px;
  .title {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    font-size: 16px;
  }
  .content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    font-size: 14px;
    background-color: #fff;
    border-radius: 5px;
    .content-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 25%;
      margin-bottom: 20px;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
        color: #ff3800;
      }
    }
  }
}

.logout-btn {
  button {
    width: 60%;
    margin: 10px auto;
    display: block;
    font-size: 13px;
    color: #616161;
    border-radius: 9px;
    border: 1px solid #dcdcdc;
    padding: 7px 0;
    text-align: center;
    background-color: #fafafa;
  }
}

// 裁剪器样式
:deep(.vue-cropper) {
  height: calc(100vh - 46px);

  .cropper-view-box {
    border-radius: 50%;
    outline: 2px solid #fff;
  }

  .cropper-face {
    background-color: inherit;
  }
}
</style>
