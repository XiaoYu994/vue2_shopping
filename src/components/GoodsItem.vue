<template>
  <div v-if="goods.goods_id" class="goods-item" @click="$router.push(`/prodetail/${goods.goods_id}`)">
    <div class="left">
      <img :src="goods.goods_image" alt="" />
    </div>
    <div class="right">
      <p class="tit text-ellipsis-2">
        {{ goods.goods_name }}
      </p>
      <p class="count">已售 {{ goods.goods_sales }} 件</p>
      <p class="price">
        <span class="new">¥{{ goods.goods_price_min }}</span>
        <span class="old">¥{{ goods.line_price_max>0 ?  goods.line_price_max : goods.goods_price_max }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: {
    goods: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
.goods-item {
  height: 160px;
  margin-bottom: 12px;
  padding: 12px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);

    &::after {
      opacity: 1;
    }

    img {
      transform: scale(1.05);
    }
  }

  .left {
    width: 135px;
    height: 135px;
    overflow: hidden;
    border-radius: 10px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 10px;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }
  }

  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.4;
    padding: 4px 4px 4px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .tit {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin: 0;
      line-height: 1.5;
      font-size: 15px;
      color: #2c3e50;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .count {
      color: #666;
      font-size: 13px;
      margin: 8px 0;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background-color: #67c23a;
        border-radius: 50%;
        margin-right: 6px;
        opacity: 0.8;
      }
    }

    .price {
      color: #333;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      display: flex;
      align-items: baseline;

      .new {
        color: #ff4949;
        margin-right: 12px;
        font-weight: 600;
        font-size: 18px;

        &::before {
          content: '¥';
          font-size: 14px;
          margin-right: 2px;
          font-weight: normal;
        }
      }

      .old {
        text-decoration: line-through;
        font-size: 13px;
        color: #909399;

        &::before {
          content: '¥';
          font-size: 12px;
          margin-right: 1px;
        }
      }
    }
  }
}
</style>
