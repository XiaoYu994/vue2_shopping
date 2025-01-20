<template>
  <div class="cart">
    <van-nav-bar
      fixed
      title="购物车"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <!-- 购物车开头 -->
    <div class="cart-title">
      <span class="all">共<i>{{cartTotal}}</i>件商品</span>
      <span class="edit">
        <van-icon name="edit" />
        编辑
      </span>
    </div>

    <!-- 购物车列表 -->
    <div class="cart-list">
      <div class="cart-item" v-for="item in list" :key="item.id" >
        <van-checkbox></van-checkbox>
        <div class="show" @click="$router.push(`/detail/${item.goods_id}`)">
          <img :src="item.goods.goods_image" alt="">
        </div>
        <div class="info">
          <span class="tit text-ellipsis-2">{{item.goods.goods_name}}</span>
          <span class="bottom">
            <div class="price">¥ <span>{{item.goods.goods_price_max * item.goods_num}}</span></div>
            <CountBox :value="item.goods_num" @input="value => handelChange(item.goods_id,value,item.goods_sku_id)"></CountBox>
          </span>
        </div>
      </div>
    </div>

    <div class="footer-fixed">
      <div  class="all-check">
        <van-checkbox  icon-size="18"></van-checkbox>
        全选
      </div>

      <div class="all-total">
        <div class="price">
          <span>合计：</span>
          <span>¥ <i class="totalPrice">99.99</i></span>
        </div>
        <div v-if="true" class="goPay">结算(5)</div>
        <div v-else class="delete">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CountBox from '@/components/countBox.vue'
export default {
  name: 'CartPage',
  data () {
    return {
      timer: null
    }
  },
  components: {
    CountBox
  },
  created () {
    if (this.isLogin) { this.$store.dispatch('cart/getdata') }
  },
  destroyed () {
    // TODO 如果后端的接口支持 数组的形式传递的话，更新的操作应该可以放在离开页面的时候吧，减少发送请求的次数
  },
  computed: {
    isLogin () {
      return this.$store.getters.token
    },
    ...mapState('cart', ['list', 'cartTotal'])
  },
  methods: {
    async handelChange (goodsId, goodsNum, goodsSkuId) {
      await this.$store.dispatch('cart/update', {
        goodsId,
        goodsNum,
        goodsSkuId
      })
    }
  }

}
</script>

<style lang="less" scoped>
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .show img {
      width: 100px;
      height: 100px;
    }
    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          span {
            font-size: 16px;
          }
        }
        .count-box {
          display: flex;
          width: 110px;
          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }
          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    .price {
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay, .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }

}
</style>
