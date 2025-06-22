<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { getBlogListByUserIdServer } from '@/api/blog'
import { getUserBaseInfoServer, getCollectionsByUserIdServer } from '@/api/user'
import { formatNum } from '@/utils/publicfn'
import { useUserInfoStore } from '@/stores'
import '@/assets/iconfont/iconfont.css'

//需要用到当前登陆用户的信息
const userStore = useUserInfoStore()

//记录一个状态值，当前的查看的用户是否为登录用户
const isCurrentUser = ref<boolean>(false)

const activeName = ref('articles')

//创建一个路由对象
const route = useRoute()

const handleClick = (tab: any, event: any) => {
  if (tab.props.name === 'collections') {
    getCollectList()
  } else {
    getBlogList()
  }
}

//文章列表的接口
interface blogType {
  blog_id: number
  title: string
  summary: string
  status: string
  type: string
  view_count: number
  updated_at: string
  like_count: number
  comment_count: number
  cover_image: string
}

//定义收藏的接口
interface collectType {
  id: number
  title: string
  cover_image: string
  nick_name: string
  created_at: string
}

const statusMap = {
  draft: '草稿',
  published: '已发布',
  pending: '待审核',
  rejected: '已拒绝',
}

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

//分页操作
const page_info = ref({
  page: 1,
  total_page: 1,
  total: 12,
  size: 12,
})

//当前用户的文章列表
const blogList = reactive<blogType[]>([])
const getBlogList = async () => {
  //首先获取用户的id值
  try {
    const res = (await getBlogListByUserIdServer(userInfo.value.user_id)).data
    //清空之前的数据
    blogList.splice(0, blogList.length)
    res.data.forEach((item: blogType) => {
      item.status = statusMap[item.status as keyof typeof statusMap]
      item.type = typeMap[item.type as keyof typeof typeMap]
      blogList.push(item)
    })
  } catch {
    ElMessage.error('获取文章列表失败！')
  }
}

//用户的收藏列表
const collectList = reactive<collectType[]>([])
const getCollectList = async () => {
  try {
    const res = (await getCollectionsByUserIdServer(userInfo.value.user_id, page_info.value.page))
      .data
    //先把之前已经有的数据都清空
    collectList.splice(0, collectList.length)
    Object.assign(collectList, res.data)
    page_info.value.total_page = res.page_info.totalPages
    page_info.value.total = res.page_info.limit * page_info.value.total_page
    page_info.value.size = res.page_info.limit
  } catch (error: any) {
    ElMessage.error(error.response.data.message)
  }
}

//点击浏览详细的文本信息
const viewDetail = (id: number) => {
  const fullPath = router.resolve({ name: 'detailArticle', params: { id: id } }).href
  window.open(fullPath, '_blank')
}

//用户的信息
const userInfo = ref({
  user_id: 0,
  author: '',
  created_at: '',
  avatar_url: '',
  signature: '',
})

//当前用户的获赞数以及收藏数以及被浏览数
const total_num = ref({
  view_count: '',
  like_count: '',
  collect_count: '',
})

//获取所查看用户的信息
const getUserBaseInfo = async () => {
  userInfo.value.user_id = Number(route.params.userId)
  try {
    const res = (await getUserBaseInfoServer(userInfo.value.user_id)).data
    userInfo.value = res.data.user_info
    total_num.value.view_count = formatNum(Number(res.data.total_count.view_count))
    total_num.value.like_count = formatNum(Number(res.data.total_count.like_count))
    total_num.value.collect_count = formatNum(Number(res.data.total_count.collect_count))
    if (userStore.UserInfo.id === userInfo.value.user_id) {
      isCurrentUser.value = true
    }
  } catch {
    return ElMessage.error('获取用户信息失败！')
  }
}

//编辑信息
const editId = ref<number>(0)

//点击编辑按钮的时候，跳转到编辑界面
const handleToEditBlog = (blog_id: number) => {
  router.push({ name: 'editArticleView', params: { blog_id } })
}

onMounted(() => {
  getUserBaseInfo()
  getBlogList()
})
</script>

<template>
  <div class="container">
    <div class="top"></div>

    <div class="profile_container">
      <div class="avatar_container">
        <img :src="userInfo.avatar_url" alt="头像" />
      </div>

      <div class="mid">
        <h1>{{ userInfo.author }}</h1>
        <p class="join-date">
          <i class="fas fa-calendar-alt"></i>
          加入明诺光笺时间：{{ userInfo.created_at }}
        </p>
        <p class="bio">
          {{ userInfo.signature }}
        </p>

        <!-- <div class="badges">
          <div class="badge"><i class="fas fa-medal"></i>金牌作者</div>
          <div class="badge success"><i class="fas fa-star"></i>优质创作者</div>
          <div class="badge warning"><i class="fas fa-fire"></i>活跃用户</div>
          <div class="badge info"><i class="fas fa-code"></i>技术专家</div>
        </div> -->
      </div>

      <div class="right">
        <el-button type="primary" plain round v-if="isCurrentUser">
          <el-icon><Edit /></el-icon>编辑资料
        </el-button>

        <div class="stats">
          <div class="stat">
            <div class="stat-value">{{ total_num.like_count }}</div>
            <div class="stat-label">获赞</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ total_num.collect_count }}</div>
            <div class="stat-label">收藏</div>
          </div>
          <!-- <div class="stat">
            <div class="stat-value">28</div>
            <div class="stat-label">关注</div>
          </div> -->
          <div class="stat">
            <div class="stat-value">{{ total_num.view_count }}</div>
            <div class="stat-label">浏览</div>
          </div>
        </div>
      </div>
    </div>

    <div class="blog_container">
      <div class="left">
        <h2>个人成就</h2>

        <div class="achievement">
          <i class="fas fa-thumbs-up"></i>
          <div class="content">
            <h3>获得63次点赞</h3>
            <p>内容受到广泛认可</p>
          </div>
        </div>

        <div class="achievement">
          <i class="fas fa-comment"></i>
          <div class="content">
            <h3>内容获得28次评论</h3>
            <p>积极与读者互动</p>
          </div>
        </div>

        <div class="achievement">
          <i class="fas fa-bookmark"></i>
          <div class="content">
            <h3>获得44次收藏</h3>
            <p>高质量内容值得收藏</p>
          </div>
        </div>

        <div class="achievement">
          <i class="fas fa-fire"></i>
          <div class="content">
            <h3>连续签到120天</h3>
            <p>坚持不懈的创作者</p>
          </div>
        </div>

        <div class="achievement">
          <i class="fas fa-trophy"></i>
          <div class="content">
            <h3>月度最佳创作者</h3>
            <p>2024年3月获得此荣誉</p>
          </div>
        </div>

        <div class="social-links">
          <a href="#" class="social-link">
            <i class="fab fa-github"></i>
          </a>
          <a href="#" class="social-link">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="social-link">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a href="#" class="social-link">
            <i class="fab fa-bilibili"></i>
          </a>
        </div>
      </div>

      <div class="right-content">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="文章" name="articles">
            <div class="tab-content tab-animation">
              <div class="post-list">
                <div
                  class="post-card"
                  v-for="blog in blogList"
                  :key="blog.blog_id"
                  @click="viewDetail(blog.blog_id)"
                  @mouseenter="editId = blog.blog_id"
                  @mouseleave="editId = 0"
                >
                  <div>
                    <img :src="blog.cover_image" alt="" />
                  </div>

                  <div style="margin-left: 20px">
                    <div class="post-header">
                      <a class="post-title" @click.stop="viewDetail(blog.blog_id)">{{
                        blog.title
                      }}</a>
                      <div class="post-date">
                        {{ blog.updated_at }} <span v-show="isCurrentUser">{{ blog.status }}</span>
                      </div>
                    </div>
                    <p class="post-excerpt" @click.stop="viewDetail(blog.blog_id)">
                      {{ blog.summary }}
                    </p>
                    <div class="post-footer">
                      <div class="post-stats">
                        <div class="post-stat">
                          <i class="iconfont icon-icon-"></i> {{ blog.view_count }}
                        </div>
                        <div class="post-stat">
                          <i class="iconfont icon-dianzan"></i> {{ blog.like_count }}
                        </div>
                        <div class="post-stat">
                          <i class="iconfont icon-pinglun"></i> {{ blog.comment_count }}
                        </div>
                      </div>
                      <!-- <div class="post-tags">
                        <span class="post-tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
                      </div> -->
                      <div>
                        <span
                          style="margin-right: 10px"
                          v-show="editId === blog.blog_id && isCurrentUser"
                          @click.stop="handleToEditBlog(blog.blog_id)"
                          >编辑</span
                        >
                        <el-tag type="success">{{ blog.type }}</el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="收藏" name="collections">
            <div class="tab-content tab-animation">
              <div class="collection-grid">
                <div
                  class="collection-card"
                  v-for="collection in collectList"
                  :key="collection.id"
                  @click="viewDetail(collection.id)"
                >
                  <div class="collection-img">
                    <img :src="collection.cover_image" alt="" />
                  </div>
                  <div class="collection-body">
                    <div class="collection-title">{{ collection.title }}</div>
                    <div class="collection-info">
                      <span>{{ collection.nick_name }} </span>
                      <span>收藏于 {{ collection.created_at }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- <el-tab-pane label="动态" name="activity">
            <div class="tab-content tab-animation">
              <div class="activity-list">
                <div class="activity-item" v-for="activity in activities" :key="activity.id">
                  <div class="activity-icon">
                    <i :class="activity.icon"></i>
                  </div>
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-desc">{{ activity.description }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: var(--bg-color);
  min-height: calc(100vh - 60px);
  padding-bottom: 40px;
}

.top {
  height: 180px;
  background: var(--card-hover-text-1);
  position: relative;
}

.profile_container {
  margin: 0 auto;
  background-color: var(--card-bg);
  width: 90%;
  max-width: 1200px;
  display: flex;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  position: relative;
  z-index: 10;
  margin-top: -40px;
  padding: 25px;
  transition: all 0.4s;
  overflow: hidden;
}

.profile_container:hover {
  box-shadow: var(--shadow-hover);
}

.avatar_container {
  margin-left: 10px;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.1);
  transform: translate(0, -20px);
  border: 4px solid white;
  overflow: hidden;
  transition: all 0.4s;
  position: relative;
}

.avatar_container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 50%, rgba(255, 255, 255, 0.3));
  z-index: 2;
}

.avatar_container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mid {
  width: 300px;
  margin-top: 10px;
  margin-left: 30px;
  flex-grow: 1;
}

.mid h1 {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: var(--text-main);
  font-weight: 700;
}

.mid .join-date {
  color: var(--card-text);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.mid .bio {
  color: var(--text-secondary);
  font-size: 15px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.mid .badges {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.badge {
  background: var(--primary-light);
  color: var(--primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #bfdbfe;
}

.badge i {
  font-size: 14px;
}

.badge.success {
  background: #ecfdf5;
  color: var(--success);
  border-color: #a7f3d0;
}

.badge.warning {
  background: #fffbeb;
  color: var(--warning);
  border-color: #fde68a;
}

.badge.info {
  background: #f5f3ff;
  color: var(--info);
  border-color: #ddd6fe;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  margin-top: 10px;
  margin-right: 10px;
  gap: 15px;
}

.stats {
  display: flex;
  gap: 25px;
  text-align: center;
  background: var(--primary-light);
  padding: 15px 25px;
  border-radius: var(--border-radius);
}

.stat {
  cursor: default;
  min-width: 70px;
}

.stat:hover .stat-value {
  color: var(--primary-hover);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  transition: all 0.4s;
}

.stat-label {
  font-size: 13px;
  color: var(--card-text);
  margin-top: 2px;
}

.blog_container {
  margin: 0 auto;
  width: 90%;
  max-width: 1200px;
  margin-top: 30px;
  display: flex;
  gap: 20px;
}

.left {
  background-color: var(--card-bg);
  padding: 25px 20px;
  width: 280px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: all 0.4s;
  height: fit-content;
}

.left:hover {
  box-shadow: var(--shadow-hover);
}

.left h2 {
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--card-border);
  color: var(--text-main);
  font-weight: 600;
}

.achievement {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.5s;
}

.achievement:hover {
  background: #f8fafc;
  transform: translateX(5px);
}

.achievement:last-child {
  border-bottom: none;
}

.achievement i {
  width: 40px;
  height: 40px;
  background: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--primary);
  margin-right: 15px;
  flex-shrink: 0;
}

.achievement .content {
  flex-grow: 1;
}

.achievement h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-main);
}

.achievement p {
  font-size: 13px;
  color: var(--card-text);
}

.social-links {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 16px;
  transition: all 0.5s;
}

.social-link:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-3px);
}

.right-content {
  flex: 1;
  background-color: var(--card-bg);
  padding: 25px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: all 0.5s;
}

.right-content:hover {
  box-shadow: var(--shadow-hover);
}

:deep .el-tabs__item {
  color: var(--card-text);
}

:deep .el-tabs__item.is-active,
.el-tabs__item:hover {
  color: var(--el-color-primary);
}

.tab-content {
  margin-top: 20px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  padding: 20px;
  border-radius: 10px;
  display: flex;
  background: var(--card-bg-1);
  transition: all 0.5s;
  border: 1 solid var(--card-hover-bg);
  position: relative;
  overflow: hidden;
}

.post-card {
  img {
    width: 170px;
    height: 100px;
    object-fit: cover;
  }
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 4px;
  background: var(--primary);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.4s ease;
}

.post-card:hover::before {
  transform: scaleY(1);
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-hover-bg);
  border: 1 solid var(--card-hover-bg);
  cursor: pointer;
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.post-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--card-text);
  text-decoration: none;
  transition: all 0.4s;
  transition: all 0.5s;
}

.post-title:hover {
  color: var(--card-hover-text);
  cursor: pointer;
}

.post-date {
  color: var(--card-text);
  font-size: 13px;
  white-space: nowrap;

  span {
    margin-left: 10px;
  }
}

.post-excerpt {
  color: var(--card-text);
  margin-bottom: 15px;
  font-size: 15px;
  line-height: 1.6;
  transition: all 0.5s;
  overflow: hidden; /* 隐藏溢出的内容 */
  display: -webkit-box; /* 使用 Webkit 的 box 模型 */
  -webkit-line-clamp: 3; /* 显示的行数 */
  line-clamp: 3;
  -webkit-box-orient: vertical; /* 垂直方向排列 */
}

.post-excerpt:hover {
  color: var(--card-hover-text);
  text-decoration: underline;
  cursor: pointer;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
  font-size: 13px;
}

.post-stats {
  display: flex;
  gap: 20px;
  color: var(--card-text);
}

.post-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.4s;
}

.post-stat:hover {
  color: var(--primary);
}

.post-tags {
  display: flex;
  gap: 8px;
}

.post-tag {
  background: var(--primary-light);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.5s;
}

.post-tag:hover {
  background: var(--primary);
  color: white;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.collection-card {
  background: var(--card-bg-1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.4s;
  border: 1px solid var(--card-border-1);
  position: relative;
}

.collection-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
  cursor: pointer;
}

.collection-img {
  height: 160px;
  background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.collection-img::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
}

.collection-body {
  padding: 18px;
}

.collection-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-main);
}

.collection-title:hover {
  color: var(--card-hover-text-1);
}

.collection-info {
  font-size: 13px;
  color: var(--card-text);
  display: flex;
  justify-content: space-between;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: var(--card-text);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #e4e7ed;
}

.empty-state h3 {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 10px;
  color: var(--text-secondary);
}

.empty-state p {
  max-width: 500px;
  margin: 0 auto;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 10px;
  background: #fafbfc;
  transition: all 0.4s;
}

.activity-item:hover {
  background: #f1f5f9;
  transform: translateX(5px);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 16px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-main);
}

.activity-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.activity-time {
  font-size: 12px;
  color: var(--card-text);
}

@media (max-width: 992px) {
  .profile_container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar_container {
    margin-left: 0;
    transform: translate(0, -60px);
  }

  .mid {
    margin-left: 0;
    margin-top: -30px;
    text-align: center;
  }

  .badges {
    justify-content: center;
  }

  .right {
    align-items: center;
    margin-right: 0;
    margin-top: 20px;
  }

  .blog_container {
    flex-direction: column;
  }

  .left {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .collection-grid {
    grid-template-columns: 1fr;
  }

  .stats {
    gap: 15px;
  }

  .profile_container {
    width: 95%;
    padding: 20px 15px;
  }
}

@media (max-width: 576px) {
  .blog_container {
    width: 95%;
  }

  .stats {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    padding: 12px;
  }

  .stat {
    min-width: 70px;
  }

  .top {
    height: 150px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tab-animation {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
