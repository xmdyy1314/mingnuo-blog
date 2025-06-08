<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogDetailByIdServer, getBlogCommentsByIdServer } from '@/api/blog'

//文章的数据结构
interface articleType {
  id: number
  user_id: number
  nick_name: string
  avatar_url: string
  title: string
  content: string
  updated_at: string
}

//评论列表
const commentList = ref()

//文章的结构
const detailArticle = ref<articleType>()

const route = useRoute()
// 加载文章
const blogId = ref<number>(0)
const loadArticle = async () => {
  //先拿到router中的数据
  blogId.value = Number(route.params.id as unknown as number)
  try {
    const res = (await getBlogDetailByIdServer(blogId.value)).data.data
    //将数据加载过来了。存放到存放文章的数据中去
    detailArticle.value = {
      id: res.blog.id,
      user_id: res.author.id,
      nick_name: res.author.nick_name,
      avatar_url: res.author.avatar_url,
      title: res.blog.title,
      content: res.blog.content,
      updated_at: res.blog.created_at,
    }
  } catch (error: any) {
    ElMessage.error(error.response.data.message + '，稍后再试！')
  }
}

//加载评论
const loadComments = async () => {
  try {
    const res = (await getBlogCommentsByIdServer(blogId.value)).data
    commentList.value = res.data
  } catch (error: any) {}
}

onMounted(async () => {
  await loadArticle()
  await loadComments()
})
</script>

<template>
  <div class="article-container" v-if="detailArticle">
    <!-- 文章头部 -->
    <div class="article-header">
      <h1 class="article-title">{{ detailArticle.title }}</h1>

      <div class="article-meta">
        <div class="author-info">
          <img :src="detailArticle.avatar_url" alt="作者头像" class="author-avatar" />
          <div class="author-details">
            <span class="author-name">{{ detailArticle.nick_name }}</span>
            <div class="publish-info">
              <span>{{ detailArticle.updated_at }}</span>
              <!-- <span> · {{ detailArticle.readTime }} 分钟阅读</span> -->
            </div>
          </div>
        </div>

        <div class="stats">
          <!-- <div class="stat-item">
            <i class="far fa-eye"></i>
            <span>{{ detailArticle.views }}</span>
          </div> -->
          <!-- <div class="stat-item" @click="likeArticle" :class="{ liked: isLiked }">
            <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
            <span>{{ article.likes }}</span>
          </div> -->
        </div>
      </div>

      <div class="tags">
        <!-- <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span> -->
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="article-content">
      <!-- 使用v-html渲染Markdown内容 -->
      <div v-html="detailArticle.content"></div>
    </div>
    <commentsView v-for="(item, index) in commentList" :comment="item" :key="index"></commentsView>
  </div>

  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>正在加载文章...</p>
  </div>
</template>

<style scoped>
.article-container {
  min-height: calc(100vh - var(--header-height));
  background-color: var(--card-bg);
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 4rem;
}

/* 文章头部样式 */
.article-header {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.publish-info {
  font-size: 0.9rem;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.stat-item i {
  font-size: 1.2rem;
}

.stat-item:hover {
  color: #3498db;
}

.stat-item.liked {
  color: #e74c3c;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.tag {
  background-color: #f0f7ff;
  color: #3498db;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 评论区域样式 */
.comments-section {
  margin-top: 3rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.comments-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.comment-form {
  display: flex;
  gap: 15px;
  margin-bottom: 2rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-input {
  width: 100%;
  min-height: 100px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.comment-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.submit-btn {
  align-self: flex-end;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

/* 评论列表样式 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 1.2rem;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: 600;
  color: #2c3e50;
}

.comment-time {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.comment-text {
  line-height: 1.6;
  color: #34495e;
}

/* 加载状态 */
.loading-container {
  min-height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-title {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .article-content {
    font-size: 1rem;
  }

  .article-content :deep(h1) {
    font-size: 1.7rem;
  }

  .article-content :deep(h2) {
    font-size: 1.5rem;
  }

  .article-content :deep(h3) {
    font-size: 1.3rem;
  }
}
</style>
