<script setup lang="ts">
import type { articleType } from '@/types/article'
import { getBlogByTypeServer } from '@/api/blog'

// 这里可以添加 TypeScript 逻辑
import { ref, onMounted, reactive, watch } from 'vue'

//文章列表信息
const articleList = reactive<articleType[]>([])

//页码的信息
const pageInfo = ref({
  current_page: 1, //当前页码
  total_page: 0, //总的页码
  total: 10, //el下的总数
})

//导航栏选取的类型
//选择的标签的排序
const category = ref<string>('all')
const categorieList = reactive([
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '技术',
    value: 'tech',
  },
  {
    label: '设计',
    value: 'design',
  },
  {
    label: '生活',
    value: 'life',
  },
  {
    label: '旅行',
    value: 'travel',
  },
  {
    label: '科技',
    value: 'technology',
  },
  {
    label: '编程',
    value: 'programming',
  },
  {
    label: '摄影',
    value: 'photography',
  },
])

//分类映射表
const typeMap = {
  tech: '技术',
  design: '设计',
  technology: '科技',
  life: '生活',
  programming: '编程',
  photography: '摄影',
  travel: '旅行',
  other: '其他',
}

//点击分类函数的时候进行的函数操作
const handleChangeType = (index: number) => {
  //这里是类型值发送了改变
  //如果点击的是相同的标签，就不要再更新了。
  if (categorieList[index].value === category.value) {
    return
  }
  pageInfo.value.current_page = 1
  category.value = categorieList[index].value
  getArticleList()
}

//根据页码与类型获取文章的摘要部分的内容
const getArticleList = async () => {
  try {
    const res = (await getBlogByTypeServer(pageInfo.value.current_page, category.value)).data
    //先清空文章列表中的数据
    articleList.splice(0, articleList.length)
    //然后向里面插入数据
    res.data.forEach((item: articleType) => {
      item.type = typeMap[item.type as keyof typeof typeMap]
      articleList.push(item)
    })
    //更新页码信息
    pageInfo.value.total_page = res.page_info.total_pages
    pageInfo.value.total = pageInfo.value.total_page * 10
  } catch (error: any) {
    ElMessage.error('获取文章列表失败！')
  }
}

onMounted(async () => {
  await getArticleList()
})
</script>

<template>
  <!-- 页面头部 -->
  <header class="page-header">
    <div class="container">
      <h1 class="page-title">探索精彩内容</h1>
      <p class="page-subtitle">发现来自社区的最新文章、技术见解和创意故事</p>

      <div class="categories">
        <!-- 分类 -->
        <div
          class="category"
          v-for="(item, index) in categorieList"
          :class="{ active: category === item.value }"
          @click="handleChangeType(index)"
          :key="index"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </header>

  <!-- 主内容区 -->
  <div class="container content-container">
    <main class="main-content">
      <div class="articles-grid">
        <div v-for="item in articleList">
          <article-card :articleInfo="item" :key="item.id"></article-card>
        </div>
      </div>

      <!-- 分页控件 -->
      <div v-if="pageInfo.total > 10" class="pagination">
        <el-pagination
          v-model:current-page="pageInfo.current_page"
          background
          @current-change="getArticleList"
          layout="prev, pager, next"
          :total="pageInfo.total_page * 10"
        />
      </div>
    </main>

    <!-- 侧边栏 -->
    <aside class="sidebar">
      <!-- 热门文章 -->
      <div class="sidebar-card">
        <h3 class="sidebar-title">热门文章</h3>
        <div class="popular-posts">
          <div class="popular-post">
            <img
              src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              alt="热门文章"
              class="popular-post-image"
            />
            <div class="popular-post-content">
              <h4 class="popular-post-title">Web3.0入门指南</h4>
              <div class="popular-post-meta">技术 · 5月阅读</div>
            </div>
          </div>
          <div class="popular-post">
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              alt="热门文章"
              class="popular-post-image"
            />
            <div class="popular-post-content">
              <h4 class="popular-post-title">TypeScript高级技巧</h4>
              <div class="popular-post-meta">编程 · 6月阅读</div>
            </div>
          </div>
          <div class="popular-post">
            <img
              src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              alt="热门文章"
              class="popular-post-image"
            />
            <div class="popular-post-content">
              <h4 class="popular-post-title">Figma设计系统实战</h4>
              <div class="popular-post-meta">设计 · 5月阅读</div>
            </div>
          </div>
          <div class="popular-post">
            <img
              src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              alt="热门文章"
              class="popular-post-image"
            />
            <div class="popular-post-content">
              <h4 class="popular-post-title">风光摄影后期处理</h4>
              <div class="popular-post-meta">摄影 · 4月阅读</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签云 -->
      <div class="sidebar-card">
        <h3 class="sidebar-title">热门标签</h3>
        <div class="tags-container">
          <div class="tag">JavaScript</div>
          <div class="tag">Vue</div>
          <div class="tag">React</div>
          <div class="tag">Python</div>
          <div class="tag">设计</div>
          <div class="tag">AI</div>
          <div class="tag">Web开发</div>
          <div class="tag">移动端</div>
          <div class="tag">数据库</div>
          <div class="tag">算法</div>
          <div class="tag">云计算</div>
          <div class="tag">DevOps</div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面头部 */
.page-header {
  padding: 60px 0 40px;
  text-align: center;
  background: linear-gradient(120deg, var(--card-bg), var(--card-bg-1));
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.8rem;
  margin-bottom: 15px;
  color: var(--dark);
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--gray);
  max-width: 700px;
  margin: 0 auto 30px;
}

.categories {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.category {
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--light-gray);
}

.category:hover,
.category.active {
  background: var(--tag-bg);
  border-color: var(--tag-bg);
}

/* 文章网格布局 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

/* 侧边栏 */
.content-container {
  display: flex;
  gap: 30px;
}

.main-content {
  flex: 1;
}

.sidebar {
  width: 300px;
}

.sidebar-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: var(--card-shadow);
}

.sidebar-title {
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--light-gray);
  color: var(--dark);
}

.popular-posts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popular-post {
  display: flex;
  gap: 15px;
  transition: var(--transition);
  padding: 5px;
  border-radius: 8px;
}

.popular-post:hover {
  background: var(--light);
}

.popular-post-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.popular-post-content {
  flex: 1;
}

.popular-post-title {
  font-weight: 600;
  margin-bottom: 5px;
  transition: var(--transition);
}

.popular-post:hover .popular-post-title {
  color: var(--primary);
}

.popular-post-meta {
  color: var(--gray);
  font-size: 0.85rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: var(--light);
  color: var(--gray);
  padding: 6px 15px;
  border-radius: 30px;
  font-size: 0.9rem;
  transition: var(--transition);
}

.tag:hover {
  color: var(--tag-bg);
  transform: translateY(-2px);
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: var(--dark);
}

.form-group input {
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid var(--light-gray);
  transition: var(--transition);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 40px 0;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid var(--light-gray);
  cursor: pointer;
  transition: var(--transition);
}

.page-btn:hover,
.page-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* 页脚 */
.footer {
  background: var(--dark);
  color: white;
  padding: 60px 0 30px;
  margin-top: 60px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.copyright {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 2.2rem;
  }
}
</style>
