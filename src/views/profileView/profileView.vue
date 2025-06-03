<template>
  <div class="blog-personal-center">
    <!-- 主内容区 -->
    <el-main class="main-container">
      <div class="profile-container">
        <!-- 左侧个人信息 -->
        <div class="profile-sidebar">
          <el-card class="user-card">
            <div class="user-header">
              <el-avatar :size="100" :src="userInfo.avatar" />
              <div class="user-name">{{ userInfo.name }}</div>
              <div class="user-title">{{ userInfo.title }}</div>
              <el-tag type="success" effect="dark" round>
                <el-icon><Star /></el-icon>
                博主
              </el-tag>
            </div>

            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-value">{{ userStats.articles }}</div>
                <div class="stat-label">文章</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.followers }}</div>
                <div class="stat-label">粉丝</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.likes }}</div>
                <div class="stat-label">获赞</div>
              </div>
            </div>

            <div class="user-info">
              <div class="info-item">
                <el-icon><User /></el-icon>
                <span>用户名: {{ userInfo.username }}</span>
              </div>
              <div class="info-item">
                <el-icon><Location /></el-icon>
                <span>地区: {{ userInfo.location }}</span>
              </div>
              <div class="info-item">
                <el-icon><Link /></el-icon>
                <span
                  >网站:
                  <a :href="userInfo.website" target="_blank">{{ userInfo.website }}</a></span
                >
              </div>
              <div class="info-item">
                <el-icon><Calendar /></el-icon>
                <span>加入时间: {{ userInfo.joinDate }}</span>
              </div>
            </div>

            <el-divider />

            <div class="user-bio">
              <h3>个人简介</h3>
              <p>{{ userInfo.bio }}</p>
            </div>

            <el-button type="primary" class="edit-btn" round>
              <el-icon><Edit /></el-icon>
              编辑资料
            </el-button>
          </el-card>

          <el-card class="skills-card">
            <h3>技能标签</h3>
            <div class="skills-tags">
              <el-tag
                v-for="(tag, index) in userInfo.skills"
                :key="index"
                type="info"
                class="skill-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </el-card>
        </div>

        <!-- 右侧内容区域 -->
        <div class="profile-content">
          <el-tabs v-model="activeTab" class="content-tabs">
            <el-tab-pane label="我的文章" name="articles">
              <div class="article-list">
                <div v-for="article in articles" :key="article.id" class="article-item">
                  <div class="article-cover">
                    <el-image :src="article.cover" fit="cover" class="cover-img" />
                  </div>
                  <div class="article-info">
                    <div class="article-header">
                      <h3 class="article-title">{{ article.title }}</h3>
                      <el-tag
                        :type="article.status === 'published' ? 'success' : 'warning'"
                        size="small"
                      >
                        {{ article.status === 'published' ? '已发布' : '草稿' }}
                      </el-tag>
                    </div>
                    <p class="article-desc">{{ article.description }}</p>
                    <div class="article-meta">
                      <span
                        ><el-icon><Calendar /></el-icon> {{ article.date }}</span
                      >
                      <span
                        ><el-icon><View /></el-icon> {{ article.views }} 阅读</span
                      >
                      <span
                        ><el-icon><ChatDotRound /></el-icon> {{ article.comments }} 评论</span
                      >
                      <span
                        ><el-icon><Star /></el-icon> {{ article.likes }} 点赞</span
                      >
                    </div>
                  </div>
                  <div class="article-actions">
                    <el-button type="primary" size="small" text
                      ><el-icon><Edit /></el-icon>编辑</el-button
                    >
                    <el-button type="danger" size="small" text
                      ><el-icon><Delete /></el-icon>删除</el-button
                    >
                  </div>
                </div>
              </div>

              <el-pagination
                background
                layout="prev, pager, next"
                :total="50"
                :page-size="5"
                class="pagination"
              />
            </el-tab-pane>

            <el-tab-pane label="数据统计" name="stats">
              <div class="stats-container">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-card shadow="hover" class="stat-card">
                      <div class="stat-icon total-articles">
                        <el-icon><Document /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">128</div>
                        <div class="stat-label">文章总数</div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card shadow="hover" class="stat-card">
                      <div class="stat-icon total-views">
                        <el-icon><View /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">24.8K</div>
                        <div class="stat-label">总阅读量</div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card shadow="hover" class="stat-card">
                      <div class="stat-icon total-comments">
                        <el-icon><ChatDotRound /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">892</div>
                        <div class="stat-label">总评论数</div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card shadow="hover" class="stat-card">
                      <div class="stat-icon total-likes">
                        <el-icon><Star /></el-icon>
                      </div>
                      <div class="stat-content">
                        <div class="stat-value">5.6K</div>
                        <div class="stat-label">总点赞数</div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>

                <el-card class="chart-card">
                  <h3>文章数据趋势</h3>
                  <div class="chart-placeholder">
                    <!-- 这里实际项目中会放置图表 -->
                    <el-icon :size="60"><DataAnalysis /></el-icon>
                    <p>文章阅读量、评论数趋势图表</p>
                  </div>
                </el-card>

                <el-card class="popular-articles">
                  <h3>热门文章</h3>
                  <ul>
                    <li v-for="(article, index) in popularArticles" :key="index">
                      <span class="index">{{ index + 1 }}</span>
                      <span class="title">{{ article.title }}</span>
                      <span class="views">{{ article.views }} 阅读</span>
                    </li>
                  </ul>
                </el-card>
              </div>
            </el-tab-pane>

            <el-tab-pane label="账号设置" name="settings">
              <el-form label-width="120px" class="settings-form">
                <el-form-item label="用户名">
                  <el-input v-model="settings.username" />
                </el-form-item>

                <el-form-item label="昵称">
                  <el-input v-model="settings.name" />
                </el-form-item>

                <el-form-item label="电子邮箱">
                  <el-input v-model="settings.email" type="email" />
                </el-form-item>

                <el-form-item label="个人网站">
                  <el-input v-model="settings.website" />
                </el-form-item>

                <el-form-item label="地区">
                  <el-cascader v-model="settings.location" :options="locationOptions" />
                </el-form-item>

                <el-form-item label="个人简介">
                  <el-input v-model="settings.bio" type="textarea" :rows="4" />
                </el-form-item>

                <el-form-item label="技能标签">
                  <el-select
                    v-model="settings.skills"
                    multiple
                    filterable
                    allow-create
                    placeholder="请添加技能标签"
                  >
                    <el-option
                      v-for="item in skillOptions"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="头像">
                  <el-upload
                    class="avatar-uploader"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                  >
                    <img v-if="settings.avatar" :src="settings.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                  </el-upload>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="saveSettings">保存设置</el-button>
                  <el-button>重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-main>

    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="footer-content">
        <div class="copyright">© 2023 博客空间 - 分享知识与见解的平台</div>
        <div class="links">
          <a href="#">关于我们</a> | <a href="#">联系方式</a> | <a href="#">用户协议</a> |
          <a href="#">隐私政策</a>
        </div>
      </div>
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Notebook,
  User,
  Location,
  Link,
  Calendar,
  Star,
  Edit,
  View,
  ChatDotRound,
  Delete,
  Document,
  DataAnalysis,
  Plus,
} from '@element-plus/icons-vue'

// 用户信息
const userInfo = ref({
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  name: '张明',
  title: '前端开发工程师',
  username: '@zhangming',
  location: '北京市',
  website: 'https://zhangming.dev',
  joinDate: '2022年3月',
  bio: '热爱前端技术，专注于Vue和React开发。喜欢分享技术文章，热衷于开源社区。希望通过博客记录和分享我的学习历程和技术见解。',
  skills: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'CSS3', 'Webpack'],
})

// 用户统计
const userStats = ref({
  articles: 42,
  followers: 1280,
  likes: 5680,
})

// 文章列表
const articles = ref([
  {
    id: 1,
    title: 'Vue3 Composition API 最佳实践',
    description:
      '本文详细介绍了Vue3 Composition API的使用技巧和最佳实践，帮助开发者更好地组织代码。',
    cover: 'https://via.placeholder.com/150',
    date: '2023-05-12',
    views: 2450,
    comments: 32,
    likes: 156,
    status: 'published',
  },
  {
    id: 2,
    title: 'TypeScript 高级类型技巧',
    description: '探索TypeScript的高级类型特性，包括条件类型、映射类型和模板字面量类型等。',
    cover: 'https://via.placeholder.com/150',
    date: '2023-04-28',
    views: 1890,
    comments: 24,
    likes: 98,
    status: 'published',
  },
  {
    id: 3,
    title: '前端性能优化完全指南',
    description: '从加载性能到运行时性能，全面介绍前端性能优化的各种技巧和方法。',
    cover: 'https://via.placeholder.com/150',
    date: '2023-04-15',
    views: 3210,
    comments: 45,
    likes: 210,
    status: 'published',
  },
  {
    id: 4,
    title: '深入理解CSS Grid布局',
    description: 'CSS Grid是现代Web布局的强大工具，本文将带你深入理解其核心概念和实际应用。',
    cover: 'https://via.placeholder.com/150',
    date: '2023-03-30',
    views: 1560,
    comments: 18,
    likes: 87,
    status: 'published',
  },
  {
    id: 5,
    title: 'Node.js后端服务架构设计',
    description: '如何设计高可用、可扩展的Node.js后端服务架构？本文将分享我的实践经验。',
    cover: 'https://via.placeholder.com/150',
    date: '2023-03-20',
    views: 980,
    comments: 12,
    likes: 54,
    status: 'draft',
  },
])

// 热门文章
const popularArticles = ref([
  { title: 'Vue3响应式原理深度解析', views: 5420 },
  { title: 'JavaScript异步编程全指南', views: 4870 },
  { title: 'CSS动画与过渡效果实战', views: 3980 },
  { title: 'Webpack 5配置完全指南', views: 3760 },
  { title: '前端工程化实践与思考', views: 3450 },
])

// 设置表单数据
const settings = ref({
  username: '@zhangming',
  name: '张明',
  email: 'zhangming@example.com',
  website: 'https://zhangming.dev',
  location: ['china', 'beijing'],
  bio: '热爱前端技术，专注于Vue和React开发。喜欢分享技术文章，热衷于开源社区。希望通过博客记录和分享我的学习历程和技术见解。',
  skills: ['Vue.js', 'React', 'TypeScript', 'Node.js'],
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
})

// 地区选项
const locationOptions = [
  {
    value: 'china',
    label: '中国',
    children: [
      { value: 'beijing', label: '北京' },
      { value: 'shanghai', label: '上海' },
      { value: 'guangzhou', label: '广州' },
      { value: 'shenzhen', label: '深圳' },
    ],
  },
  {
    value: 'usa',
    label: '美国',
    children: [
      { value: 'newyork', label: '纽约' },
      { value: 'losangeles', label: '洛杉矶' },
      { value: 'chicago', label: '芝加哥' },
    ],
  },
]

// 技能选项
const skillOptions = [
  'Vue.js',
  'React',
  'Angular',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'CSS3',
  'HTML5',
  'Webpack',
  'Vite',
  'Docker',
  'Git',
]

// 激活的导航
const activeNav = ref('home')
// 激活的标签页
const activeTab = ref('articles')

// 头像上传成功处理
const handleAvatarSuccess = (response: any, file: File) => {
  settings.value.avatar = URL.createObjectURL(file.raw)
}

// 保存设置
const saveSettings = () => {
  // 实际项目中这里会调用API保存设置
  console.log('保存设置:', settings.value)
  ElMessage.success('设置保存成功')
}
</script>

<style scoped>
.blog-personal-center {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.user-actions {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-left: 20px;
  cursor: pointer;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  flex: 1;
}

.profile-container {
  display: flex;
  gap: 20px;
}

.profile-sidebar {
  flex: 0 0 300px;
}

.profile-content {
  flex: 1;
  min-width: 0;
}

.user-card {
  margin-bottom: 20px;
}

.user-header {
  text-align: center;
  padding: 20px 0;
}

.user-name {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 5px;
}

.user-title {
  color: #909399;
  margin-bottom: 10px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.user-info {
  padding: 10px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.info-item .el-icon {
  margin-right: 8px;
  color: #909399;
}

.user-bio h3 {
  margin-bottom: 10px;
  color: #606266;
}

.user-bio p {
  color: #606266;
  line-height: 1.6;
}

.edit-btn {
  width: 100%;
  margin-top: 15px;
}

.skills-card {
  margin-top: 20px;
}

.skills-card h3 {
  margin-bottom: 15px;
}

.skill-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.content-tabs {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.article-list {
  margin-top: 20px;
}

.article-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.article-item:last-child {
  border-bottom: none;
}

.article-cover {
  flex: 0 0 120px;
  margin-right: 20px;
}

.cover-img {
  width: 120px;
  height: 80px;
  border-radius: 4px;
}

.article-info {
  flex: 1;
}

.article-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.article-title {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
  margin-bottom: 0;
}

.article-desc {
  color: #606266;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  color: #909399;
  font-size: 13px;
}

.article-meta span {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.article-meta .el-icon {
  margin-right: 5px;
}

.article-actions {
  flex: 0 0 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pagination {
  margin-top: 30px;
  justify-content: center;
}

.stats-container {
  margin-top: 20px;
}

.stat-card {
  margin-bottom: 20px;
  text-align: center;
}

.stat-icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 50%;
  font-size: 30px;
  margin-bottom: 15px;
}

.stat-icon .el-icon {
  vertical-align: middle;
}

.total-articles {
  background-color: #ecf5ff;
  color: #409eff;
}

.total-views {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.total-comments {
  background-color: #f0f9eb;
  color: #67c23a;
}

.total-likes {
  background-color: #fef0f0;
  color: #f56c6c;
}

.stat-content {
  padding: 5px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.chart-card {
  margin-top: 20px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  background-color: #fafafa;
  border-radius: 4px;
  margin-top: 15px;
}

.chart-placeholder p {
  margin-top: 15px;
}

.popular-articles {
  margin-top: 20px;
}

.popular-articles ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.popular-articles li {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.popular-articles li:last-child {
  border-bottom: none;
}

.popular-articles .index {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: #f2f6fc;
  border-radius: 4px;
  margin-right: 15px;
  font-size: 14px;
  color: #409eff;
}

.popular-articles .title {
  flex: 1;
  font-size: 15px;
}

.popular-articles .views {
  color: #909399;
  font-size: 14px;
}

.settings-form {
  margin-top: 20px;
  max-width: 600px;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
}

.footer {
  background-color: #fff;
  color: #909399;
  text-align: center;
  padding: 20px 0;
  margin-top: 40px;
  border-top: 1px solid #ebeef5;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.copyright {
  margin-bottom: 10px;
}

.links a {
  color: #606266;
  text-decoration: none;
  margin: 0 8px;
}

.links a:hover {
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .profile-container {
    flex-direction: column;
  }

  .profile-sidebar {
    flex: 0 0 auto;
    width: 100%;
  }

  .nav-menu {
    margin: 0 20px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    height: auto;
    padding: 10px;
  }

  .logo {
    margin-bottom: 10px;
  }

  .nav-menu {
    margin: 10px 0;
    order: 3;
    width: 100%;
  }

  .article-item {
    flex-direction: column;
  }

  .article-cover {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .article-actions {
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .el-col {
    margin-bottom: 20px;
  }
}
</style>
