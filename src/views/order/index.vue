<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.go(-1)" />
    <van-tabs v-model="active">
      <van-tab name="all"  title="全部"></van-tab>
      <van-tab name="payment"  title="待支付"></van-tab>
      <van-tab name="delivery" title="待发货"></van-tab>
      <van-tab name="received" title="待收货"></van-tab>
      <van-tab name="comment"  title="待评价"></van-tab>
    </van-tabs>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <template v-if="list.length">
          <OrderListItem
            v-for="item in list"
            :key="item.order_id"
            :item="item"
            @click-item="$router.push(`/order/detail/${item.order_id}`)"
            @on-cancel="handleCancel"
            @on-pay="handlePay"
            @on-confirm="handleConfirm"
            @on-comment="handleComment"
          />
        </template>

        <van-empty
          v-else
          class="custom-empty"
          image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
          :description="emptyText"
        >
          <template #bottom>
            <van-button round type="danger" class="bottom-button" @click="$router.push('/home')">
              去逛逛
            </van-button>
          </template>
        </van-empty>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getOrderList, cancel, payOrder, confirmReceipt } from '@/api/order'
import loginConfirm from '@/mixins/loginConfirm'
import OrderListItem from '@/components/OrderListItem.vue'

export default {
  name: 'OrderPage',
  components: {
    OrderListItem
  },
  data () {
    return {
      active: this.$route.query.dataType || 'all',
      page: 1,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageSize: 10
    }
  },
  computed: {
    emptyText () {
      const textMap = {
        all: '暂无订单',
        payment: '暂无待支付订单',
        delivery: '暂无待发货订单',
        received: '暂无待收货订单',
        comment: '暂无待评价订单'
      }
      return textMap[this.active] || '暂无订单'
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList (isRefresh = false) {
      try {
        if (isRefresh) {
          this.page = 1
          this.finished = false
        }

        const { data: { list } } = await getOrderList(this.active, this.page)
        const { data, total } = list

        // 处理订单商品总数
        const processedData = data.map(item => ({
          ...item,
          total_num: item.goods.reduce((sum, goods) => sum + goods.total_num, 0)
        }))

        if (isRefresh) {
          // 刷新时直接替换数据
          this.list = processedData
        } else {
          // 加载更多时去重合并
          const newList = [...this.list]
          processedData.forEach(item => {
            // 检查是否已存在相同订单
            const existingIndex = newList.findIndex(existing => existing.order_id === item.order_id)
            if (existingIndex === -1) {
              // 不存在则添加
              newList.push(item)
            } else {
              // 存在则更新
              newList[existingIndex] = item
            }
          })
          this.list = newList
        }

        this.page++
        this.loading = false

        if (this.list.length >= total) {
          this.finished = true
        }
      } catch (error) {
        console.error('获取订单列表失败：', error)
        this.$toast.fail('获取订单列表失败')
        this.loading = false
      }
    },
    // 取消订单
    async handleCancel (orderId) {
      this.$dialog.confirm({
        title: '提示',
        message: '确认取消订单吗？'
      })
        .then(async () => {
          await cancel(orderId)
          this.$toast.success('取消成功')
          // 重新渲染
          setTimeout(() => {
            this.getOrderList()
          }, 500)
        })
        .catch(() => {})
    },
    async handlePay (orderId) {
      if (this.loginConfirm()) return
      try {
        await payOrder(orderId)
        this.$toast.success('支付成功')
        this.getOrderList()
      } catch (error) {
        this.$toast.fail('支付失败')
      }
    },
    async handleConfirm (orderId) {
      try {
        await this.$dialog.confirm({
          title: '确认收货',
          message: '确认已收到商品吗？'
        })
        await confirmReceipt(orderId)
        this.$toast.success('确认收货成功')
        this.getOrderList()
      } catch (error) {
        if (error === 'cancel') return
        this.$toast.fail('确认收货失败')
      }
    },
    handleComment (orderId) {
      this.$router.push(`/comment/${orderId}`)
    },
    onLoad () {
      this.getOrderList()
    },
    onRefresh () {
      this.getOrderList(true)
      this.refreshing = false
    }
  },
  watch: {
    active: {
      handler () {
        this.refreshing = true
        this.onRefresh()
      }
    }
  },
  mixins: [loginConfirm]
}
</script>

<style lang="less" scoped>
.order {
  background-color: #fafafa;
  min-height: 100vh;
}

.van-tabs {
  position: sticky;
  top: 0;
}

.custom-empty {
  padding: 80px 0;

  .bottom-button {
    width: 160px;
    height: 40px;
    margin-top: 20px;
    background: linear-gradient(to right, #ff6034, #ee0a24);
    border: none;
  }
}
</style>
