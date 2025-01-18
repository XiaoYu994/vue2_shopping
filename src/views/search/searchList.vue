<template>
    <div class="search">
      <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

      <van-search
        readonly
        shape="round"
        background="#ffffff"
        :value="goodsName || '搜索商品'"
        show-action
        @click="$router.push('/search')"
      >
        <template #action>
          <van-icon class="tool" name="apps-o" />
        </template>
      </van-search>

      <!-- 排序选项按钮 -->
      <div class="sort-btns">
        <div class="sort-item">综合</div>
        <div class="sort-item" @click="sortType='sales'">销量</div>
        <div class="sort-item" @click="sortType='price'">价格 </div>
      </div>

      <div class="goods-list">
        <GoodsItem v-for="item in list" :key="item.goods_id" :goods="item"></GoodsItem>
      </div>
    </div>
  </template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getGoodsList } from '@/api/goods'
export default {
  name: 'SearchIndex',
  data () {
    return {
      sortType: 'all',
      sortPrice: '0',
      page: '1',
      list: []
    }
  },
  components: {
    GoodsItem
  },
  computed: {
    goodsName () {
      return this.$route.query.search
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取搜索到的商品数据
    async getGoodsList () {
      const { data: { list } } = await getGoodsList({
        sortType: this.sortType,
        sortPrice: this.sortPrice,
        page: this.page,
        goodsName: this.goodsName
      })
      this.list = list.data
    }
  }
}
</script>

  <style lang="less" scoped>
  .search {
    padding-top: 46px;
    ::v-deep .van-icon-arrow-left {
      color: #333;
    }
    .tool {
      font-size: 24px;
      height: 40px;
      line-height: 40px;
    }

    .sort-btns {
      display: flex;
      height: 36px;
      line-height: 36px;
      .sort-item {
        text-align: center;
        flex: 1;
        font-size: 16px;
      }
    }
  }

  // 商品样式
  .goods-list {
    background-color: #f6f6f6;
  }
  </style>
