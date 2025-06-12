<template>
  <div class="container">
    <div class="home-page">
      <!-- 英雄区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">记录思考的痕迹，分享生活的美好</h1>
          <p class="hero-subtitle">一个关于技术、生活与旅行的个人博客空间</p>
          <el-button type="primary" size="large" @click="scrollToArticles">探索文章</el-button>
        </div>
        <div class="hero-image">
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="博客封面"
          />
        </div>
      </section>

      <!-- 精选文章 -->
      <section class="featured-articles">
        <div class="section-header">
          <h2 class="section-title">精选文章</h2>
          <el-link type="primary" underline="never" @click="$router.push('/articles')"
            >查看全部</el-link
          >
        </div>

        <div class="articles-container">
          <el-card
            v-for="(article, index) in featuredArticles"
            :key="index"
            shadow="hover"
            class="article-card"
          >
            <div class="article-image">
              <img :src="article.image" :alt="article.title" />
            </div>
            <div class="article-content">
              <div class="article-meta">
                <span><i class="el-icon-date"></i> {{ article.date }}</span>
                <span><i class="el-icon-view"></i> {{ article.views }} 阅读</span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <div class="article-footer">
                <div class="article-tags">
                  <el-tag
                    v-for="(tag, tagIndex) in article.tags"
                    :key="tagIndex"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <el-button link @click="$router.push(article.link)">阅读全文</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </section>

      <!-- 分类展示 -->
      <section class="categories-section">
        <h2 class="section-title">文章分类</h2>
        <div class="categories-container">
          <el-card
            v-for="(category, index) in categories"
            :key="index"
            shadow="hover"
            class="category-card"
            @click="$router.push(category.link)"
          >
            <div class="category-icon">
              <i :class="category.icon" class="icon"></i>
            </div>
            <h3 class="category-title">{{ category.title }}</h3>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-meta">
              <span>{{ category.articleCount }} 篇文章</span>
            </div>
          </el-card>
        </div>
      </section>

      <!-- 作者介绍 -->
      <section class="author-section">
        <div class="author-container">
          <div class="author-image">
            <el-avatar :size="120" :src="author.avatar" />
          </div>
          <div class="author-info">
            <h2 class="author-name">{{ author.name }}</h2>
            <p class="author-bio">{{ author.bio }}</p>
            <div class="author-stats">
              <div class="stat-item">
                <div class="stat-value">{{ author.stats.articles }}</div>
                <div class="stat-label">文章</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ author.stats.followers }}</div>
                <div class="stat-label">粉丝</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ author.stats.likes }}</div>
                <div class="stat-label">点赞</div>
              </div>
            </div>
            <el-button type="primary" plain @click="$router.push('/about')">关于作者</el-button>
          </div>
        </div>
      </section>

      <!-- 最新评论 -->
      <section class="comments-section">
        <h2 class="section-title">最新评论</h2>
        <div class="comments-container">
          <div v-for="(comment, index) in latestComments" :key="index" class="comment-card">
            <div class="comment-header">
              <el-avatar :size="40" :src="comment.avatar" />
              <div class="comment-user">
                <span class="username">{{ comment.user }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
            </div>
            <div class="comment-content">
              <p>{{ comment.content }}</p>
            </div>
            <div class="comment-article">
              <span>评论文章：</span>
              <el-link type="primary" underline="never" @click="$router.push(comment.articleLink)">
                {{ comment.articleTitle }}
              </el-link>
            </div>
          </div>
        </div>
      </section>

      <!-- 订阅区域 -->
      <!-- <section class="subscribe-section">
        <div class="subscribe-container">
          <div class="subscribe-content">
            <h2>订阅更新</h2>
            <p>获取最新文章和独家内容，第一时间了解我的分享</p>
            <el-form class="subscribe-form">
              <el-input v-model="email" placeholder="请输入您的邮箱地址" class="email-input">
                <template #append>
                  <el-button type="primary" @click="subscribe">订阅</el-button>
                </template>
              </el-input>
            </el-form>
          </div>
        </div>
      </section> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import '@/assets/iconfont/iconfont.css'

// 精选文章数据
const featuredArticles = ref([
  {
    id: 1,
    title: '现代前端开发中的状态管理新趋势',
    excerpt:
      '随着React、Vue等框架的不断演进，状态管理作为前端开发的核心问题也在不断发展。本文将探讨Redux、MobX、Recoil等状态管理库的优缺点，并分析最新趋势...',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    date: '2023-10-15',
    views: 1242,
    tags: ['前端开发', 'React', '状态管理'],
    link: '/article/1',
  },
  {
    id: 2,
    title: '西藏之旅：高原上的心灵洗礼',
    excerpt:
      '西藏，这个被称作"世界屋脊"的地方，一直是我心中的向往。今年夏天，我终于踏上了这片神圣的土地。从布达拉宫的宏伟到纳木错的纯净，从藏族同胞的热情到高原反应的挑战...',
    image:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80',
    date: '2023-10-08',
    views: 986,
    tags: ['旅行', '摄影', '西藏'],
    link: '/article/2',
  },
  {
    id: 3,
    title: 'ChatGPT与AI写作：机遇、挑战与未来',
    excerpt:
      '人工智能写作工具如ChatGPT的兴起正在改变内容创作的方式。本文从技术角度分析这些工具的工作原理，探讨它们为创作者带来的效率提升，同时也反思其对原创性和创造力的潜在影响...',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
    date: '2023-10-01',
    views: 1568,
    tags: ['人工智能', 'ChatGPT', '写作'],
    link: '/article/3',
  },
])

// 分类数据
const categories = ref([
  {
    id: 1,
    title: '技术开发',
    icon: 'iconfont icon-cpu',
    description: '前端、后端、数据库、架构设计等技术文章',
    articleCount: 24,
    link: '/tech',
  },
  {
    id: 2,
    title: '旅行游记',
    icon: 'iconfont icon-lvxing',
    description: '国内外旅行见闻、攻略与体验分享',
    articleCount: 16,
    link: '/travel',
  },
  {
    id: 3,
    title: '摄影技巧',
    icon: 'iconfont icon-zhaoxiangji',
    description: '摄影技术、后期处理与作品展示',
    articleCount: 12,
    link: '/photography',
  },
  {
    id: 4,
    title: '生活随笔',
    icon: 'iconfont icon-jilu',
    description: '日常生活、读书笔记与个人思考',
    articleCount: 28,
    link: '/life',
  },
])

// 作者信息
const author = ref({
  name: '墨迹',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
  bio: '前端工程师，热爱旅行和摄影的写作者。相信技术改变世界，文字温暖人心。在这里分享我的代码经验、生活感悟和旅行见闻。',
  stats: {
    articles: 128,
    followers: '5.6K',
    likes: '24.8K',
  },
})

// 最新评论
const latestComments = ref([
  {
    id: 1,
    user: '前端小王子',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    time: '2小时前',
    content: '这篇文章对状态管理的分析非常透彻，特别是对Zustand的介绍让我受益匪浅！',
    articleTitle: '现代前端开发中的状态管理新趋势',
    articleLink: '/article/1',
  },
  {
    id: 2,
    user: '旅行达人',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    time: '昨天',
    content: '看完你的西藏游记，我立刻订了去拉萨的机票！照片拍得太美了，攻略也很实用。',
    articleTitle: '西藏之旅：高原上的心灵洗礼',
    articleLink: '/article/2',
  },
  {
    id: 3,
    user: 'AI探索者',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    time: '3天前',
    content: '对AI写作的伦理分析很有深度，完全赞同你的观点，技术应该服务于人类而不是取代创造力。',
    articleTitle: 'ChatGPT与AI写作：机遇、挑战与未来',
    articleLink: '/article/3',
  },
])

const email = ref('')

// 滚动到文章区域
const scrollToArticles = () => {
  const element = document.querySelector('.featured-articles')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 订阅功能
const subscribe = () => {
  if (email.value && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
    ElMessage.success('订阅成功！感谢您的关注')
    email.value = ''
  } else {
    ElMessage.error('请输入有效的邮箱地址')
  }
}
</script>

<style scoped lang="scss">
.container {
  padding-bottom: 80px;
}

.home-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  padding: 80px 0;
  margin-bottom: 60px;

  .hero-content {
    flex: 1;

    .hero-title {
      font-size: 2.8rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 20px;
      // color: var(--el-text-color-primary);
    }

    .hero-subtitle {
      font-size: 1.2rem;
      // color: var(--el-text-color-secondary);
      margin-bottom: 40px;
      max-width: 600px;
    }
  }

  .hero-image {
    flex: 1;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      transition: transform 0.5s ease;

      &:hover {
        transform: scale(1.03);
      }
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-color);
    position: relative;
    padding-bottom: 10px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: var(--el-color-primary);
      border-radius: 3px;
    }
  }
}

.featured-articles {
  margin-bottom: 80px;

  .articles-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
  }

  .article-card {
    --el-card-border-color: var(--card-border);
    border-radius: 12px;
    overflow: hidden;
    color: var(--text-color);
    background-color: var(--card-bg);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    height: 100%;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    .article-image {
      height: 220px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
    }

    .article-content {
      padding: 25px;

      .article-meta {
        display: flex;
        gap: 20px;
        font-size: 0.9rem;
        margin-bottom: 15px;
      }

      .article-title {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 15px;
      }

      .article-excerpt {
        margin-bottom: 20px;
        line-height: 1.6;
      }

      .article-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .article-tags {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
}

.categories-section {
  margin-bottom: 80px;
  .categories-container {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }

  .category-card {
    text-align: center;
    padding: 40px 25px;
    border-radius: 16px;
    cursor: pointer;
    color: var(--text-color);
    transition: all 0.3s ease;
    background-color: var(--bg-color);
    --el-card-border-color: var(--card-border);

    &:hover {
      background: var(--card-bg);
      transform: translateY(-5px);

      .category-icon {
        background: var(--el-color-primary);
        transform: scale(1.1);

        .icon {
          color: white;
        }
      }
    }

    .category-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 25px;
      border-radius: 50%;
      background: var(--el-color-primary-light-8);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      .icon {
        font-size: 36px;
        color: var(--el-color-primary);
      }
    }

    .category-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .category-description {
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .category-meta {
      font-weight: 500;
    }
  }
}

.author-section {
  background: linear-gradient(135deg, var(--card-bg-1) 0%, #e4edf9 100%);
  border-radius: 16px;
  padding: 60px 40px;
  margin-bottom: 80px;

  .author-container {
    display: flex;
    align-items: center;
    gap: 50px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .author-image {
    flex-shrink: 0;
  }

  .author-info {
    flex: 1;

    .author-name {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .author-bio {
      font-size: 1.1rem;
      line-height: 1.8;
      margin-bottom: 30px;
    }

    .author-stats {
      display: flex;
      gap: 40px;
      margin-bottom: 30px;

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
        }
      }
    }
  }
}

.comments-section {
  margin-bottom: 80px;

  .comments-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
  }

  .comment-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;

      .comment-user {
        display: flex;
        flex-direction: column;

        .username {
          font-weight: 600;
        }

        .comment-time {
          font-size: 0.9rem;
        }
      }
    }

    .comment-content {
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .comment-article {
      display: flex;
      align-items: center;
      font-size: 0.9rem;

      span {
        margin-right: 5px;
      }
    }
  }
}

.subscribe-section {
  background: linear-gradient(135deg, var(--el-color-primary) 0%, #6a11cb 100%);
  border-radius: 16px;
  padding: 70px 40px;

  .subscribe-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    color: white;

    h2 {
      font-size: 2.2rem;
      margin-bottom: 15px;
    }

    p {
      font-size: 1.1rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }

    .subscribe-form {
      max-width: 600px;
      margin: 0 auto;

      .email-input {
        :deep(.el-input-group__append) {
          background: var(--el-color-primary-dark-2);
          border: none;
        }

        :deep(.el-input__inner) {
          height: 50px;
          border: none;
          border-radius: 30px;
          padding-left: 25px;
        }

        :deep(.el-input-group__append) {
          border-radius: 0 30px 30px 0;
          padding: 0 25px;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 60px 0;

    .hero-content {
      .hero-subtitle {
        max-width: 100%;
      }
    }
  }

  .author-section .author-container {
    flex-direction: column;
    text-align: center;

    .author-stats {
      justify-content: center;
    }
  }
}

@media (max-width: 768px) {
  .hero-section {
    .hero-title {
      font-size: 2.2rem;
    }
  }

  .featured-articles .articles-container {
    grid-template-columns: 1fr;
  }
}
</style>
