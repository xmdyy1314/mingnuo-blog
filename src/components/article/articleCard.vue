<script setup lang="ts">
import { computed, defineProps, onMounted, type PropType, reactive } from 'vue'
import type { articleType } from '@/types/article'
import router from '@/router/index'

//产看文章的详情
const viewDetail = (id: number) => {
  const fullPath = router.resolve({ name: 'detailArticle', params: { id: id } }).href
  window.open(fullPath, '_blank')
}

//分类列表值
const categorieList = reactive([
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

//首先就是从父亲哪里接受内容
const props = defineProps({
  articleInfo: {
    type: Object as PropType<articleType>,
    required: true,
  },
})

onMounted(() => {
  let i = 0
  for (i = 0; i < categorieList.length; i++) {
    if (categorieList[i].value === props.articleInfo.type) {
      props.articleInfo.type = categorieList[i].label
      return
    }
  }
})
</script>

<template>
  <div class="article-card">
    <div class="card-header">
      <img :src="articleInfo.cover_image" alt="文章封面" class="card-image" />
      <div class="card-tag">{{ articleInfo.type }}</div>
    </div>
    <div class="card-body">
      <h3 class="card-title" @click="viewDetail(articleInfo.id)">{{ articleInfo.title }}</h3>
      <p class="card-excerpt" @click="viewDetail(articleInfo.id)">
        {{ articleInfo.summary }}
      </p>
      <div class="card-meta">
        <img :src="articleInfo.author.avatar_url" alt="作者头像" class="author-avatar" />
        <div class="author-info">
          <div class="author-name">{{ articleInfo.author.nick_name }}</div>
          <div class="publish-date">{{ articleInfo.publish_time }}</div>
        </div>
        <div class="stats">
          <div class="stat">
            <el-icon><View /></el-icon> {{ articleInfo.view_count }}
          </div>
          <div class="stat"><i class="far fa-heart"></i> 128</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  transition: all 0.8s;
}

.card-title:hover {
  cursor: pointer;
  color: var(--card-hover-text);
}

.card-excerpt {
  margin-bottom: 20px;
  flex-grow: 1;
  transition: all 0.8s;
}

.card-excerpt:hover {
  cursor: pointer;
  color: var(--card-hover-text);
  text-decoration: underline;
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
</style>
