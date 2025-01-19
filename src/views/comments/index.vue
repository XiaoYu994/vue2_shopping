<template>
    <div class="comments-page">
      <van-nav-bar
        fixed
        title="商品评价"
        left-arrow
        @click-left="$router.go(-1)"
      />

      <div class="comments-container">
        <!-- 评价统计 -->
        <div class="comment-stats">
          <div class="rate-box">
            <div class="rate-num">{{ goodRate }}%</div>
            <div class="rate-text">好评率</div>
          </div>
          <div class="tags-box">
            <div
              v-for="(tag, index) in tags"
              :key="index"
              :class="['tag-item', { active: currentTag === tag.score }]"
              @click="switchTag(tag.score)"
            >
              {{ tag.name }} ({{ tag.count }})
            </div>
          </div>
        </div>

        <!-- 评价列表 -->
        <div class="comment-list">
          <div
            v-for="item in commentList"
            :key="item.comment_id"
            class="comment-item"
          >
          <!-- 用户信息 -->
            <div class="user-info">
              <img :src="item.user.avatar_url || defaultAvatar" class="avatar">
              <span class="nickname">{{ item.user.nick_name }}</span>
              <van-rate
                :value="item.score"
                :size="12"
                color="#ffd21e"
                void-icon="star"
                void-color="#eee"
                readonly
              />
            </div>
            <!-- 评价内容 -->
            <div class="comment-content">{{ item.content }}</div>
            <div class="comment-images" v-if="item.images && item.images.length">
              <img
                v-for="(img, imgIndex) in item.images"
                :key="imgIndex"
                :src="img.image_url"
                @click="previewImage(item.images, imgIndex)"
              >
            </div>
            <!-- 商品规格 -->
            <div class="comment-spec" v-if="item.spec_value">{{ item.spec_value }}</div>
            <div class="comment-time">{{ item.create_time }}</div>
          </div>
        </div>

        <!-- 加载更多 -->
        <van-loading v-if="loading" class="loading">加载中...</van-loading>
        <div v-if="finished" class="no-more">没有更多评价了</div>
      </div>
    </div>
  </template>

<script>
import { getCommentList } from '@/api/comments'
import defaultAvatar from '@/assets/default-avatar.png'
// 实现图片预览
import { ImagePreview } from 'vant'
export default {
  name: 'CommentsPage',
  data () {
    return {
      defaultAvatar,
      commentList: [],
      currentTag: -1,
      page: 1,
      loading: false,
      finished: false,
      tags: [
        { name: '全部', count: 0, score: -1 },
        { name: '好评', count: 0, score: 10 },
        { name: '中评', count: 0, score: 20 },
        { name: '差评', count: 0, score: 30 }
      ]
    }
  },
  created () {
    this.loadComments()
  },
  computed: {
    goodsId () {
      return this.$route.query.goodsId
    },
    goodRate () {
      console.log(this.tags[0].count)

      return ((this.tags[1].count / this.tags[0].count) * 100).toFixed(2)
    }
  },
  methods: {
    async loadComments () {
      if (this.loading || this.finished) return

      this.loading = true
      try {
        const { data: { list } } = await getCommentList(this.currentTag, this.goodsId, this.page)

        console.log(list.data)
        this.tags[0].count = list.total
        console.log(this.tags[0].count)

        // 更新评价标签数量
        list.data.forEach(item => {
          if (item.score) {
            if (item.score < 20) this.tags[1].count++
            if (item.score < 30 && item.score >= 20) this.tags[2].count++
            if (item.score < 40 && item.score >= 30) this.tags[3].count++
          }
        })

        // 追加评价列表 加载更多时 将数据增加到原有数据的后面
        this.commentList = [...this.commentList, ...list.data]

        // 判断是否加载完成
        if (this.commentList.length >= list.total) {
          this.finished = true
        } else {
          this.page++
        }
      } catch (error) {
        console.error('获取评价列表失败：', error)
        this.$toast('加载失败，请重试')
      } finally {
        this.loading = false
      }
    },
    switchTag (tag) {
      if (this.currentTag === tag) return
      this.currentTag = tag
      this.page = 1
      this.commentList = []
      this.finished = false
      this.loadComments()
    },
    // 实现图片预览功能
    previewImage (images, index) {
      console.log(images)

      const urls = images.map(img => img.image_url)
      ImagePreview({
        images: urls,
        startPosition: index
      })
    }
  },
  mounted () {
    // 监听滚动到底部
    const container = document.querySelector('.comments-container')
    container.addEventListener('scroll', () => {
      const { scrollHeight, scrollTop, clientHeight } = container
      if (scrollHeight - scrollTop - clientHeight < 50) {
        this.loadComments()
      }
    })
  }
}
</script>

  <style lang="less" scoped>
  .comments-page {
    min-height: 100vh;
    background: #f5f5f5;
  }

  .comments-container {
    padding-top: 46px;
    height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .comment-stats {
    background: #fff;
    padding: 15px;
    margin-bottom: 10px;

    .rate-box {
      text-align: center;
      margin-bottom: 15px;

      .rate-num {
        font-size: 24px;
        color: #f44;
        font-weight: bold;
      }

      .rate-text {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
      }
    }

    .tags-box {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .tag-item {
        padding: 5px 12px;
        border-radius: 15px;
        background: #f5f5f5;
        font-size: 12px;
        color: #666;

        &.active {
          background: #fff1f1;
          color: #f44;
        }
      }
    }
  }

  .comment-list {
    .comment-item {
      background: #fff;
      padding: 15px;
      margin-bottom: 10px;

      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .nickname {
          font-size: 14px;
          color: #333;
          margin-right: 8px;
        }
      }

      .comment-content {
        text-align: left;
        font-size: 14px;
        color: #333;
        line-height: 1.5;
        margin-bottom: 10px;
      }

      .comment-images {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 10px;

        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }
      }

      .comment-spec {
        text-align: left;
        font-size: 12px;
        color: #999;
        margin-bottom: 5px;
      }

      .comment-time {
        text-align: left;
        font-size: 12px;
        color: #999;
      }
    }
  }

  .loading,
  .no-more {
    text-align: center;
    color: #999;
    font-size: 12px;
    padding: 15px 0;
  }
  </style>
