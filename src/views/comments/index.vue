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
              :class="['tag-item', { active: currentTag === tag.name }]"
              @click="switchTag(tag.name)"
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
            <div class="comment-content">{{ item.content }}</div>
            <div class="comment-images" v-if="item.images && item.images.length">
              <img
                v-for="(img, imgIndex) in item.images"
                :key="imgIndex"
                :src="img.image_url"
                @click="previewImage(item.images, imgIndex)"
              >
            </div>
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
import { getComments } from '@/api/comments'
import defaultAvatar from '@/assets/default-avatar.png'

export default {
  name: 'CommentsPage',
  data () {
    return {
      goodsId: null,
      defaultAvatar,
      commentList: [],
      currentTag: '全部',
      goodRate: 98,
      page: 1,
      loading: false,
      finished: false,
      tags: [
        { name: '全部', count: 0 },
        { name: '好评', count: 0 },
        { name: '中评', count: 0 },
        { name: '差评', count: 0 },
        { name: '有图', count: 0 }
      ]
    }
  },
  created () {
    this.goodsId = this.$route.params.id
    this.loadComments()
  },
  methods: {
    async loadComments () {
      if (this.loading || this.finished) return

      this.loading = true
      try {
        const { data } = await getComments({
          goods_id: this.goodsId,
          page: this.page,
          type: this.currentTag === '全部' ? '' : this.currentTag
        })

        const { list, total, tags } = data

        // 更新评价标签数量
        if (tags) {
          this.tags = this.tags.map(tag => ({
            ...tag,
            count: tags[tag.name.toLowerCase()] || 0
          }))
        }

        // 追加评价列表
        this.commentList = [...this.commentList, ...list]

        // 判断是否加载完成
        if (this.commentList.length >= total) {
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
    previewImage (images, index) {
      const urls = images.map(img => img.image_url)
      this.$imagePreview({
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
        font-size: 12px;
        color: #999;
        margin-bottom: 5px;
      }

      .comment-time {
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
