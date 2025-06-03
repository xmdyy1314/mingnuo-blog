<template>
  <!-- 页面头部 -->
  <header class="page-header">
    <div class="container">
      <h1 class="page-title">探索精彩内容</h1>
      <p class="page-subtitle">发现来自社区的最新文章、技术见解和创意故事</p>

      <div class="categories">
        <div class="category" :class="{ active: category_index === 0 }" @click="category_index = 0">
          全部
        </div>
        <div class="category" :class="{ active: category_index === 1 }" @click="category_index = 1">
          技术
        </div>
        <div class="category" :class="{ active: category_index === 2 }" @click="category_index = 2">
          设计
        </div>
        <div class="category" :class="{ active: category_index === 3 }" @click="category_index = 3">
          生活
        </div>
        <div class="category" :class="{ active: category_index === 4 }" @click="category_index = 4">
          旅行
        </div>
        <div class="category" :class="{ active: category_index === 5 }" @click="category_index = 5">
          科技
        </div>
        <div class="category" :class="{ active: category_index === 6 }" @click="category_index = 6">
          编程
        </div>
        <div class="category" :class="{ active: category_index === 7 }" @click="category_index = 7">
          摄影
        </div>
      </div>
    </div>
  </header>

  <!-- 主内容区 -->
  <div class="container content-container">
    <main class="main-content">
      <div class="articles-grid">
        <!-- 文章卡片 1 -->
        <div class="article-card">
          <div class="card-header">
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="文章封面"
              class="card-image"
            />
            <div class="card-tag">编程</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">深入理解Vue3响应式原理</h3>
            <p class="card-excerpt">
              本文将深入探讨Vue3的响应式系统，通过Proxy实现的响应式机制与Vue2的差异，以及Composition
              API如何改变我们的开发方式...
            </p>
            <div class="card-meta">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="作者头像"
                class="author-avatar"
              />
              <div class="author-info">
                <div class="author-name">张明</div>
                <div class="publish-date">2023年6月15日</div>
              </div>
              <div class="stats">
                <div class="stat">
                  <el-icon><View /></el-icon> 2.5K
                </div>
                <div class="stat"><i class="far fa-heart"></i> 128</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章卡片 2 -->
        <div class="article-card">
          <div class="card-header">
            <img
              src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="文章封面"
              class="card-image"
            />
            <div class="card-tag">设计</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">2023年UI设计趋势分析</h3>
            <p class="card-excerpt">
              探索2023年最具影响力的UI设计趋势，从暗黑模式到微交互，从玻璃拟态到3D元素，了解如何将这些趋势应用到你的设计项目中...
            </p>
            <div class="card-meta">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="作者头像"
                class="author-avatar"
              />
              <div class="author-info">
                <div class="author-name">李设计</div>
                <div class="publish-date">2023年6月12日</div>
              </div>
              <div class="stats">
                <div class="stat">
                  <el-icon><View /></el-icon> 3.1K
                </div>
                <div class="stat"><i class="far fa-heart"></i> 214</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章卡片 3 -->
        <div class="article-card">
          <div class="card-header">
            <img
              src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="文章封面"
              class="card-image"
            />
            <div class="card-tag">摄影</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">城市夜景摄影完全指南</h3>
            <p class="card-excerpt">
              掌握城市夜景摄影的技巧与窍门，从设备选择到构图技巧，从长曝光到光轨拍摄，让你的城市夜景照片脱颖而出...
            </p>
            <div class="card-meta">
              <img
                src="https://randomuser.me/api/portraits/men/22.jpg"
                alt="作者头像"
                class="author-avatar"
              />
              <div class="author-info">
                <div class="author-name">王摄影师</div>
                <div class="publish-date">2023年6月8日</div>
              </div>
              <div class="stats">
                <div class="stat">
                  <el-icon><View /></el-icon> 1.8K
                </div>
                <div class="stat"><i class="far fa-heart"></i> 97</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章卡片 4 -->
        <div class="article-card">
          <div class="card-header">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="文章封面"
              class="card-image"
            />
            <div class="card-tag">数据分析</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">Python数据可视化实战</h3>
            <p class="card-excerpt">
              使用Python的Matplotlib和Seaborn库创建专业级的数据可视化图表，掌握从基础图表到高级可视化的技巧...
            </p>
            <div class="card-meta">
              <img
                src="https://randomuser.me/api/portraits/women/32.jpg"
                alt="作者头像"
                class="author-avatar"
              />
              <div class="author-info">
                <div class="author-name">赵数据</div>
                <div class="publish-date">2023年6月5日</div>
              </div>
              <div class="stats">
                <div class="stat">
                  <el-icon><View /></el-icon> 2.2K
                </div>
                <div class="stat"><i class="far fa-heart"></i> 156</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章卡片 5 -->
        <div class="article-card">
          <div class="card-header">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="文章封面"
              class="card-image"
            />
            <div class="card-tag">人工智能</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">GPT-4应用开发入门</h3>
            <p class="card-excerpt">
              探索如何使用GPT-4
              API构建智能应用，从聊天机器人到内容生成，从代码助手到数据分析，开启AI应用开发之旅...
            </p>
            <div class="card-meta">
              <img
                src="https://randomuser.me/api/portraits/men/41.jpg"
                alt="作者头像"
                class="author-avatar"
              />
              <div class="author-info">
                <div class="author-name">钱AI</div>
                <div class="publish-date">2023年5月28日</div>
              </div>
              <div class="stats">
                <div class="stat">
                  <el-icon><View /></el-icon> 4.3K
                </div>
                <div class="stat"><i class="far fa-heart"></i> 342</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章卡片 6 -->
        <div class="article-card">
          <div class="card-header">
            <img
              src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="文章封面"
              class="card-image"
            />
            <div class="card-tag">前端开发</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">React 18新特性解析</h3>
            <p class="card-excerpt">
              全面了解React
              18的新特性，包括并发渲染、自动批处理、Suspense组件等，提升你的React应用性能与用户体验...
            </p>
            <div class="card-meta">
              <img
                src="https://randomuser.me/api/portraits/men/19.jpg"
                alt="作者头像"
                class="author-avatar"
              />
              <div class="author-info">
                <div class="author-name">孙前端</div>
                <div class="publish-date">2023年5月22日</div>
              </div>
              <div class="stats">
                <div class="stat">
                  <el-icon><View /></el-icon> 3.7K
                </div>
                <div class="stat"><i class="far fa-heart"></i> 287</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="1000" />
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

<script setup lang="ts">
// 这里可以添加 TypeScript 逻辑
import { ref, onMounted } from 'vue'

//选择的标签的排序
const category_index = ref<number>(0)

// 示例：管理文章数据
const articles = ref([
  {
    title: '深入理解Vue3响应式原理',
    excerpt:
      '本文将深入探讨Vue3的响应式系统，通过Proxy实现的响应式机制与Vue2的差异，以及Composition API如何改变我们的开发方式...',
    tag: '编程',
    author: '张明',
    date: '2023年6月15日',
    views: 2500,
    likes: 128,
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  // 其他文章数据...
])

// 示例：分页功能
const currentPage = ref(1)
const totalPages = ref(10)

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 加载对应页面的文章数据
    console.log(`加载第 ${page} 页`)
  }
}

onMounted(() => {
  // 页面加载完成后可以执行一些初始化操作
})
</script>

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

.article-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-hover-bg);
  transition: all 0.4s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px var(--card-hover-bg);
}

.card-header {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .card-image {
  transform: scale(1.05);
}

.card-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--tag-bg);
  padding: 5px 15px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 500;
}

.card-body {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: var(--dark);
  transition: var(--transition);
}

.article-card:hover .card-title {
  color: var(--primary);
}

.card-excerpt {
  color: var(--gray);
  margin-bottom: 20px;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid var(--light-gray);
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  border: 2px solid var(--light-gray);
}

.author-info {
  flex-grow: 1;
}

.author-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.publish-date {
  color: var(--gray);
  font-size: 0.85rem;
}

.stats {
  display: flex;
  gap: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--gray);
  font-size: 0.9rem;
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
