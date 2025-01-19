<template>
  <div class="prodetail">
    <van-nav-bar
      fixed
      title="商品详情页"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">
          {{ current + 1 }} / {{ images.length }}
        </div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ detail.goods_price_min }}</span>
          <span class="oldprice">￥{{ detail.line_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ detail.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ detail.goods_name }}
      </div>

      <div class="service" @click="show = true">
        <div class="left-words">
          <span v-for="(item, index) in serviceList" :key="index"
            ><van-icon name="passed" />{{ item.name }}</span
          >
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
      <van-action-sheet v-model="show" title="服务">
        <div class="service-content">
          <div
            v-for="(item, index) in serviceList"
            :key="index"
            class="service-item"
          >
            <div class="service-title">
              <van-icon name="passed" />
              <span>{{ item.name }}</span>
            </div>
            <div class="content">{{ item.summary }}</div>
          </div>
        </div>
      </van-action-sheet>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ this.TotalComments }}条)</div>
        <!-- // TODO 跳转评论页 -->
        <div class="right">查看更多 <van-icon name="arrow" /></div>
      </div>
      <div class="comment-list">
        <div
          class="comment-item"
          v-for="item in CommentsList"
          :key="item.comment_id"
        >
          <div class="top">
            <img :src="item.user.avatar_url || defaultImg" alt="" />
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate
              :size="16"
              :value="5"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
            />
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="detail.content"></div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div class="icon-cart">
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <div class="btn-add">加入购物车</div>
      <div class="btn-buy">立刻购买</div>
    </div>
  </div>
</template>

<script>
import { getComments } from '@/api/comments'
import { getGoodsDetail, getGoodsService } from '@/api/goods'
import defaultImg from '@/assets/default-avatar.png'

export default {
  name: 'ProDetail',
  data () {
    return {
      images: [],
      detail: {},
      current: 0,
      TotalComments: 0,
      CommentsList: [],
      defaultImg,
      show: false,
      serviceList: []
    }
  },
  computed: {
    goodsId () {
      // 不是? 形式的传参
      return this.$route.params.id
    }
  },
  created () {
    this.getGoodsDetail()
    this.getComments()
    this.getGoodsService()
  },
  methods: {
    onChange (index) {
      this.current = index
    },
    async getGoodsDetail () {
      const {
        data: { detail }
      } = await getGoodsDetail(this.goodsId)
      this.detail = detail
      this.images = detail.goods_images
      console.log(this.detail)
    },
    async getComments () {
      const {
        data: { list, total }
      } = await getComments(this.goodsId)
      this.CommentsList = list
      this.TotalComments = total
    },
    async getGoodsService () {
      const {
        data: { list }
      } = await getGoodsService(this.goodsId)
      this.serviceList = list
      console.log(list)
      console.log(this.serviceList)
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100% !important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .right-icon {
    color: #999;
  }

  .service-content {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;

  .service-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .service-title {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 15px;
      font-weight: 500;

      .van-icon {
        color: #07c160;
        margin-right: 6px;
      }
    }

    .content {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      padding-left: 24px;
    }
  }
}

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-list {
  padding: 15px;

  .comment-item {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .top {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .name {
        font-size: 14px;
        color: #333;
        margin-right: 10px;
      }
    }

    .content {
      text-align: left;
      padding: 10px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }

    .time {
      text-align: left;
      color: #999;
      font-size: 12px;
    }
  }
}

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home,
    .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}

.tips {
  padding: 10px;
}
</style>
