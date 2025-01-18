<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <van-search show-action placeholder="请输入搜索关键词" clearable v-model.trim="key" @search="add">
      <template #action>
        <div @click="add">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div class="search-history">
      <div class="title">
        <span>最近搜索</span>
        <van-icon name="delete-o" size="16" />
      </div>
      <div class="list" >
        <div class="list-item"
        v-for="(item,index) in list" :key="index"
        @click="$router.push(`/searchlist?search=${item}`)">
        {{item}}
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSearch, setSearch } from '@/utils/localStorage'
export default {
  name: 'SearchIndex',
  data () {
    return {
      list: getSearch() || [],
      key: ''
    }
  },
  methods: {
    add () {
      if (this.key === '') {
        this.$toast('请输入关键字')
        return
      }
      // 进行搜索的时候要将数据添加到数组的最前面 如果已经存在就删除再添加

      const index = this.list.indexOf(this.key)
      // 不是-1 说明有这个数据
      if (index !== -1) {
        // 删除该数据
        this.list.splice(index, 1)
      }
      this.list.unshift(this.key)
      setSearch(this.list)
      this.$router.push(`/searchlist?search=${this.key}`)
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    background-color: #fa2209;
    color: #fff;
  }
  ::v-deep .van-search__action {
    background-color: #c21401;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 5px 5px 0;
    margin-right: 10px;
  }
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
  }
  .list-item {
    width: 30%;
    text-align: center;
    padding: 7px;
    line-height: 15px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    border: 1px solid #efefef;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
}
</style>
