<template>
<div>
    <!-- 二级路由出口 -->
    <router-view></router-view>
    <van-tabbar route active-color="skyblue" inactive-color="#000">
      <van-tabbar-item to="/home"  icon="wap-home">首页</van-tabbar-item>
      <van-tabbar-item to="/category"  icon="apps-o">分类页</van-tabbar-item>
      <van-tabbar-item to="/cart"  icon="shopping-cart">购物车</van-tabbar-item>
      <van-tabbar-item to="/user"  icon="user">我的</van-tabbar-item>
    </van-tabbar>
</div>
</template>

<script>
export default {
  name: 'layoutIndex'
}
</script>

<style>

</style>
