<script setup lang="ts">
import '@/assets/iconfont/iconfont.css'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogDetailByIdServer, getBlogCommentsByIdServer } from '@/api/blog'
import { agreeBlogOrCommentServer } from '@/api/user'
import { collectBlogServer } from '@/api/user'
import router from '@/router'
import CommentsView from './commentsView.vue'

interface BlogType {
  blog: {
    id: number
    title: string
    summary: string
    content: string
    status: string
    view_count: number
    created_at: string
    updated_at: string
    type: string
    collection_count: number
    like_count: number
    comment_count: number
    cover_image: string
    avatar_url: string
  }
  status: {
    //点赞收藏这些
    collect: boolean
    like: boolean
  }
  author: {
    id: number
    nick_name: string
    avatar_url: string
  }
}

// 评论列表
const commentList = ref<any[]>([])

// 文章数据
const detailArticle = ref<BlogType>()

const route = useRoute()
const blogId = ref<number>(0)

// 加载文章
const loadArticle = async () => {
  blogId.value = Number(route.params.id as unknown as number)
  try {
    const res = (await getBlogDetailByIdServer(blogId.value)).data
    detailArticle.value = res.data
  } catch (error: any) {
    ElMessage.error(error.response.data.message + '，稍后再试！')
  }
}

// 加载评论
const loadComments = async () => {
  try {
    const res = (await getBlogCommentsByIdServer(blogId.value)).data
    commentList.value = res.data
  } catch (error: any) {
    console.error('加载评论失败:', error)
  }
}

// 刷新评论
const refreshComments = async () => {
  await loadComments()
}

// 去往个人中心界面
const viewAuthor = (id: number) => {
  const fullPath = router.resolve({ name: 'profileView', params: { userId: id } }).href
  window.open(fullPath, '_blank')
}

// 评论抽屉控制
const drawer = ref<boolean>(false)

// 处理抽屉打开/关闭时的滚动
watch(drawer, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
  } else {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
  }
})

//收藏
const collectBlog = async () => {
  if (!detailArticle.value) {
    return ElMessage.error('收藏出错！')
  }
  try {
    if (detailArticle.value?.status.collect) {
      //表示取消收藏
      await collectBlogServer(detailArticle.value.blog.id, 'uncollect')
      detailArticle.value.blog.collection_count--
      detailArticle.value.status.collect = false
    } else {
      //表示取消收藏
      await collectBlogServer(detailArticle.value.blog.id, 'collect')
      detailArticle.value.blog.collection_count++
      detailArticle.value.status.collect = true
    }
  } catch (error: any) {
    ElMessage.error(error.response.data.message)
  }
}

//点赞博客
const agreeBlog = async () => {
  if (!detailArticle.value) {
    return ElMessage.error('博客点赞错误！')
  }
  try {
    if (detailArticle.value?.status.like) {
      //取消收藏
      await agreeBlogOrCommentServer(detailArticle.value.blog.id, 'unlike', 'blog')
      detailArticle.value.status.like = false
      detailArticle.value.blog.like_count--
    } else {
      await agreeBlogOrCommentServer(detailArticle.value.blog.id, 'like', 'blog')
      detailArticle.value.status.like = true
      detailArticle.value.blog.like_count++
    }
  } catch (error: any) {
    ElMessage.error(error.response.data.message)
  }
}

//儿子中有评论了，调用函数进行操作使得评论数进行一个相应的更新
const addBlogCommentCount = () => {
  if (detailArticle.value) {
    detailArticle.value.blog.comment_count++
  }
}

onMounted(async () => {
  await loadArticle()
})
</script>

<template>
  <div class="article-container" v-if="detailArticle">
    <!-- 文章头部 -->
    <div class="article-header">
      <h1 class="article-title">{{ detailArticle.blog.title }}</h1>

      <div class="article-meta">
        <div class="author-info" @click="viewAuthor(detailArticle.author.id)">
          <img :src="detailArticle.author.avatar_url" alt="作者头像" class="author-avatar" />
          <div class="author-details">
            <span class="author-name">{{ detailArticle.author.nick_name }}</span>
            <div class="publish-info">
              <span>{{ detailArticle.blog.created_at }}</span>
            </div>
          </div>
        </div>

        <div class="stats">
          <!-- 统计数据占位 -->
        </div>
      </div>

      <div class="tags">
        <!-- 标签占位 -->
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="article-content">
      <div v-html="detailArticle.blog.content"></div>
    </div>
  </div>

  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>正在加载文章...</p>
  </div>

  <!-- 评论抽屉 -->
  <el-drawer v-model="drawer" title="评论" class="comments-drawer">
    <template #header>
      <div class="drawer-header">
        <h3>评论 ({{ detailArticle?.blog.comment_count }})</h3>
      </div>
    </template>

    <div class="drawer-content">
      <div class="comments-list">
        <commentsView
          @addCommentNum="addBlogCommentCount"
          :blog-id="detailArticle?.blog.id ? detailArticle?.blog.id : 0"
        >
        </commentsView>
      </div>
    </div>
  </el-drawer>

  <!-- 固定底部操作栏 -->
  <div class="action-bar">
    <div class="action-container">
      <div class="action-item" @click="agreeBlog">
        <span
          v-if="detailArticle?.status.like"
          class="iconfont icon-dianzan-shixin status_action status_action"
        ></span>
        <span v-else class="iconfont icon-dianzan"></span>
        <span :class="{ status_action: detailArticle?.status.like }">{{
          detailArticle?.blog.like_count
        }}</span>
      </div>
      <div class="action-item" @click="collectBlog">
        <span
          v-if="detailArticle?.status.collect"
          class="iconfont icon-shoucang_shixin status_action"
        ></span>
        <span v-else class="iconfont icon-shoucang"></span>
        <span :class="{ status_action: detailArticle?.status.collect }">{{
          detailArticle?.blog.collection_count
        }}</span>
      </div>
      <div class="action-item comment-action" @click="drawer = !drawer">
        <span class="iconfont icon-pinglun"></span>
        <span>{{
          detailArticle?.blog.comment_count ? detailArticle?.blog.comment_count : '评论'
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-container {
  min-height: calc(100vh - var(--header-height));
  background-color: var(--card-bg);
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 4rem;
  border-radius: 0 0 15px 15px;
  padding-bottom: 80px; /* 为底部操作栏留出空间 */
}

/* 文章头部样式 */
.article-header {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
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
  cursor: pointer;
  transition: all 0.3s ease;
}

.author-info:hover {
  transform: translateY(-2px);
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.publish-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stats {
  display: flex;
  gap: 20px;
}

/* 文章内容样式 */
.article-content {
  line-height: 1.8;
  color: var(--text-primary);
}

.article-content :deep(h1) {
  font-size: 2rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.article-content :deep(h2) {
  font-size: 1.75rem;
  margin-top: 2.2rem;
  margin-bottom: 1.2rem;
}

.article-content :deep(h3) {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.article-content :deep(p) {
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

.article-content :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.2s;
}

.article-content :deep(a:hover) {
  color: var(--primary-hover);
  text-decoration: underline;
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
  border: 5px solid var(--border-color);
  border-top: 5px solid var(--primary-color);
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

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--card-bg);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.action-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  padding: 12px 30px;
}

.action-item {
  display: flex;
  align-items: center;
  margin-left: 24px;
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.3s ease;

  .status_action {
    color: var(--like-bg);
  }
}

.action-item:hover {
  background: var(--bg-hover);
  transform: translateY(-3px);
}

.action-item span {
  font-size: 16px;
  margin-left: 6px;
}

.iconfont {
  font-size: 20px;
}

.comment-action {
  background: var(--primary-color);
  color: white;
}

.comment-action:hover {
  background: var(--like-bg);
}

/* 评论抽屉样式 */
.comments-drawer {
  --el-drawer-bg-color: var(--card-bg) !important;
  --el-drawer-padding-primary: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
}

.drawer-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--card-text);
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.comments-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 24px;
}

.no-comments {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary);
  padding: 40px 0;
}

.no-comments p {
  margin-top: 16px;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-container {
    padding: 2rem;
    padding-bottom: 70px;
  }

  .article-title {
    font-size: 2rem;
  }

  .action-container {
    padding: 10px 20px;
  }

  .action-item {
    margin-left: 16px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .article-container {
    padding: 1.5rem;
    padding-bottom: 60px;
  }

  .article-title {
    font-size: 1.8rem;
  }

  .author-avatar {
    width: 40px;
    height: 40px;
  }

  .action-item {
    margin-left: 12px;
    padding: 5px 10px;
  }

  .action-item span {
    font-size: 14px;
  }

  .iconfont {
    font-size: 18px;
  }
}
</style>
