<template>
    <div class="loading-wrapper" v-if="loading">
      <div class="loading">
        <van-loading type="spinner" color="#ee0a24" />
        <span class="text">加载中...</span>
      </div>
    </div>
  </template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LoadingIndex',
  computed: {
    ...mapState(['loading'])
  }
}
</script>

  <style lang="less" scoped>
  .loading-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;

    .loading {
      background: #fff;
      padding: 20px 30px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .text {
        margin-top: 8px;
        font-size: 14px;
        color: #666;
      }
    }
  }
  </style>
