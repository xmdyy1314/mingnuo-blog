<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserInfoStore } from '@/stores'
import router from '@/router'

//跳转到字文章的界面，应该单独开一页才好

// 用户信息类型
interface UserInfo {
  id: number
  nick_name: string
  avatar_url: string
  email: string
}

// 用户数据
const user = ref<UserInfo>({
  id: -1,
  nick_name: '',
  avatar_url: '/avatar.jpg',
  email: '',
})

//用户的个人信息仓库
const userStore = useUserInfoStore()

//是否为登录状态
const isLoggedIn = ref(true)

// 搜索建议类型
interface SearchSuggestion {
  value: string
  link: string
}

// 通知类型
interface Notification {
  id: number
  type: 'comment' | 'like' | 'system'
  title: string
  time: string
  read: boolean
}

const route = useRoute()

// 响应式状态
const activeIndex = ref('')
const drawerVisible = ref(false)
const searchQuery = ref('')
const isDarkMode = ref(false)
const searchPopoverVisible = ref(false)
const unreadNotifications = ref(3)
const logoAnimating = ref(false)

// 搜索历史
const searchHistory = ref<string[]>(['Vue3', 'TypeScript', '响应式设计', '前端工程化'])

// 搜索建议数据
const searchSuggestions = ref<SearchSuggestion[]>([
  { value: 'Vue3 新特性', link: '/search?q=Vue3' },
  { value: 'TypeScript 高级技巧', link: '/search?q=TypeScript' },
  { value: 'Element Plus 使用指南', link: '/search?q=ElementPlus' },
  { value: '响应式设计原理', link: '/search?q=响应式设计' },
  { value: '前端工程化实践', link: '/search?q=前端工程化' },
  { value: 'CSS 动画技巧', link: '/search?q=CSS动画' },
  { value: 'Node.js 性能优化', link: '/search?q=Nodejs' },
  { value: 'Webpack 配置指南', link: '/search?q=Webpack' },
])

// 通知数据
const notifications = ref<Notification[]>([
  { id: 1, type: 'comment', title: '墨小凡评论了你的文章', time: '5分钟前', read: false },
  { id: 2, type: 'like', title: '你的文章获得了32个赞', time: '2小时前', read: false },
  { id: 3, type: 'system', title: '系统维护通知：本周六凌晨2-4点', time: '昨天', read: true },
  { id: 4, type: 'comment', title: '前端小王子回复了你的评论', time: '昨天', read: true },
])

// 处理菜单选择
const handleSelect = (index: string) => {
  activeIndex.value = index
  drawerVisible.value = false
  router.push(index)
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 添加到搜索历史
    if (!searchHistory.value.includes(searchQuery.value)) {
      searchHistory.value.unshift(searchQuery.value)
      if (searchHistory.value.length > 5) {
        searchHistory.value.pop()
      }
    }

    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    searchQuery.value = ''
    searchPopoverVisible.value = false
  }
}

// 从历史记录搜索
const searchFromHistory = (query: string) => {
  searchQuery.value = query
  handleSearch()
}

// 选择搜索建议
const selectSuggestion = (suggestion: SearchSuggestion) => {
  router.push(suggestion.link)
  searchQuery.value = ''
  searchPopoverVisible.value = false
}

// 清除搜索历史
const clearSearchHistory = () => {
  searchHistory.value = []
}

// 删除单个搜索历史
const removeSearchHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
}

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
}

// Logo动画
const animateLogo = () => {
  if (logoAnimating.value) return
  logoAnimating.value = true
  setTimeout(() => {
    logoAnimating.value = false
  }, 1000)
}

// 处理退出登录
const handleLogout = () => {
  drawerVisible.value = false
  isLoggedIn.value = false
  localStorage.removeItem('user')
  userStore.clearUserInfo()
  userStore.removeToken()
  console.log('用户已退出登录')
  router.push('/')
}

const handleToCreate = () => {
  const fullPath = router.resolve({ name: 'createArticleView' }).href
  window.open(fullPath, '_blank')
}

//定义一个主题变量
// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDarkMode.value = savedTheme === 'dark'
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  }

  //通过token来判断是否已经登录。
  isLoggedIn.value = userStore.token ? true : false

  //进来的时候先获取用户的信息
  user.value.id = Number(userStore.UserInfo.id)

  user.value.avatar_url = userStore.UserInfo.avatar_url
    ? userStore.UserInfo.avatar_url
    : user.value.avatar_url
  user.value.nick_name = userStore.UserInfo.nick_name
    ? userStore.UserInfo.nick_name
    : userStore.UserInfo.username
  user.value.email = userStore.UserInfo.email

  //获取路由更新导航栏的信息
  const res = route.path //路由的地址，来更新
  activeIndex.value = res
})
</script>

<template>
  <div class="header-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- 动态背景层 -->
    <div class="dynamic-bg"></div>

    <div class="header-content">
      <!-- Logo区域 -->
      <router-link to="/" class="logo" @mouseenter="animateLogo">
        <div class="logo-icon">
          <i class="el-icon-notebook-2"></i>
          <div class="logo-pulse"></div>
        </div>
        <div class="logo-text">
          <span>明诺</span>
          <span class="logo-dot">·</span>
          <span>光笺</span>
        </div>
      </router-link>

      <!-- 桌面端导航菜单 -->
      <div class="desktop-nav">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          background-color="transparent"
          text-color="var(--text-color)"
          active-text-color="var(--primary-color)"
          @select="handleSelect"
        >
          <el-menu-item index="/index">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/articles">
            <el-icon><Reading /></el-icon>
            <span>文章</span>
          </el-menu-item>
          <!-- <el-sub-menu index="categories">
            <template #title>
              <el-icon><Folder /></el-icon>
              <span>分类</span>
            </template>
            <el-menu-item index="/tech">
              <el-icon><Cpu /></el-icon>
              <span>技术</span>
            </el-menu-item>
            <el-menu-item index="/life">
              <el-icon><CoffeeCup /></el-icon>
              <span>生活</span>
            </el-menu-item>
            <el-menu-item index="/travel">
              <el-icon><Location /></el-icon>
              <span>旅行</span>
            </el-menu-item>
            <el-menu-item index="/photography">
              <el-icon><Camera /></el-icon>
              <span>摄影</span>
            </el-menu-item>
          </el-sub-menu> -->
          <el-menu-item index="/about">
            <el-icon><InfoFilled /></el-icon>
            <span>关于</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧功能区 -->
      <div class="right-actions">
        <!-- 搜索框 -->
        <el-popover placement="bottom" :width="320" trigger="click" v-model="searchPopoverVisible">
          <template #reference>
            <div class="search-container" :class="{ active: searchPopoverVisible }">
              <el-input
                v-model="searchQuery"
                placeholder="搜索文章..."
                class="search-input"
                @focus="searchPopoverVisible = true"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </template>

          <div class="search-popover">
            <div v-if="searchHistory.length > 0">
              <div class="popover-header">
                <span>最近搜索</span>
                <el-link @click="clearSearchHistory">清空</el-link>
              </div>
              <div class="search-history">
                <el-tag
                  v-for="(item, index) in searchHistory"
                  :key="index"
                  class="history-tag"
                  @click="searchFromHistory(item)"
                >
                  {{ item }}
                  <el-icon class="close-icon" @click.stop="removeSearchHistory(index)">
                    <Close />
                  </el-icon>
                </el-tag>
              </div>
            </div>

            <div class="search-suggestions">
              <div class="popover-header">
                <span>热门搜索</span>
              </div>
              <div class="suggestion-list">
                <div
                  v-for="(suggestion, index) in searchSuggestions"
                  :key="index"
                  class="suggestion-item"
                  @click="selectSuggestion(suggestion)"
                >
                  <el-icon><Search /></el-icon>
                  <span>{{ suggestion.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-popover>

        <!-- 深色模式切换 -->
        <el-tooltip
          effect="dark"
          :content="isDarkMode ? '切换到亮色模式' : '切换到深色模式'"
          placement="bottom"
        >
          <div class="theme-switch" @click="toggleTheme">
            <transition name="fade" mode="out-in">
              <el-icon v-if="!isDarkMode" key="sun"><Sunny /></el-icon>
              <el-icon v-else key="moon"><Moon /></el-icon>
            </transition>
          </div>
        </el-tooltip>

        <!-- 通知区域 -->
        <el-popover placement="bottom" :width="300" trigger="click" v-if="isLoggedIn">
          <template #reference>
            <div class="notification-bell">
              <el-badge :value="unreadNotifications" :max="99" class="badge">
                <el-icon><Bell /></el-icon>
              </el-badge>
            </div>
          </template>
          <div class="notifications-popover">
            <div class="notifications-header">
              <h3>通知</h3>
              <el-link>全部已读</el-link>
            </div>
            <div class="notifications-list">
              <div v-for="(item, index) in notifications" :key="index" class="notification-item">
                <div class="notification-icon" :class="item.type">
                  <el-icon v-if="item.type === 'comment'"><ChatDotRound /></el-icon>
                  <el-icon v-if="item.type === 'like'"><Goods /></el-icon>
                  <el-icon v-if="item.type === 'system'"><BellFilled /></el-icon>
                </div>
                <div class="notification-content">
                  <div class="notification-title">{{ item.title }}</div>
                  <div class="notification-time">{{ item.time }}</div>
                </div>
              </div>
            </div>
            <div class="notifications-footer">
              <el-link type="primary" underline="never">查看所有通知</el-link>
            </div>
          </div>
        </el-popover>

        <!-- 用户区域 -->
        <!-- 登录的时候 -->
        <el-popover
          placement="bottom-end"
          :width="280"
          trigger="click"
          popper-class="user-popover"
          v-if="isLoggedIn"
        >
          <template #reference>
            <div class="user-area">
              <div class="user-avatar">
                <el-avatar :size="40" :src="user.avatar_url" />
                <div class="online-status"></div>
              </div>
              <div class="user-info">
                <div class="user-name">{{ user.nick_name }}</div>
                <div class="user-role">高级会员</div>
              </div>
            </div>
          </template>

          <div class="user-card">
            <div class="card-header">
              <div class="user-avatar-large">
                <el-avatar :size="60" :src="user.avatar_url" />
                <div class="online-status-large"></div>
              </div>
              <div class="user-info-large">
                <div class="user-name">{{ user.nick_name }}</div>
                <div class="user-email">{{ user.email }}</div>
              </div>
            </div>

            <el-divider />

            <div class="card-stats">
              <div class="stat-item">
                <div class="stat-value">128</div>
                <div class="stat-label">文章</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">5.6K</div>
                <div class="stat-label">粉丝</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">24</div>
                <div class="stat-label">收藏</div>
              </div>
            </div>

            <el-divider />

            <div class="card-actions">
              <el-button
                type="primary"
                plain
                class="action-button"
                @click="router.replace({ name: 'profileView', params: { userId: user.id } })"
              >
                <el-icon><User /></el-icon>
                <span>个人中心</span>
              </el-button>
              <el-button type="success" plain class="action-button" @click="handleToCreate">
                <el-icon><EditPen /></el-icon>
                <span>写文章</span>
              </el-button>
            </div>

            <div class="card-footer">
              <el-button type="danger" text @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-button>
            </div>
          </div>
        </el-popover>

        <!--未登录的时候 -->
        <el-popover
          placement="bottom-end"
          :width="70"
          trigger="hover"
          popper-class="user-popover"
          class="noLogin"
          v-else
        >
          <template #reference>
            <div class="user-area">
              <div class="user-avatar">
                <el-avatar :size="40" icon="User" style="font-size: 25px" />
              </div>
              <div class="user-info">
                <!-- <div class="user-name">明诺光笺</div> -->
                <div class="user-role">点击登录</div>
              </div>
            </div>
          </template>

          <div class="user-card">
            <div class="card-footer" style="text-align: center">
              <el-button type="primary" text @click="router.push({ name: 'loginView' })">
                <el-icon><Right /></el-icon>
                <span>去登录</span>
              </el-button>
            </div>
          </div>
        </el-popover>
      </div>

      <!-- 移动端菜单按钮 -->
      <!-- <div class="mobile-menu-btn" @click="drawerVisible = true">
        <el-icon><Menu /></el-icon>
      </div> -->
    </div>
    <!-- 移动端抽屉菜单 -->
    <!-- <el-drawer
      v-model="drawerVisible"
      title="导航菜单"
      direction="rtl"
      size="80%"
      class="mobile-drawer"
    >
      <div class="mobile-nav">
        <el-menu :default-active="activeIndex" class="mobile-menu" @select="handleSelect">
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/articles">
            <el-icon><Reading /></el-icon>
            <span>文章</span>
          </el-menu-item>
          <el-sub-menu index="categories">
            <template #title>
              <el-icon><Folder /></el-icon>
              <span>分类</span>
            </template>
            <el-menu-item index="/tech">
              <el-icon><Cpu /></el-icon>
              <span>技术</span>
            </el-menu-item>
            <el-menu-item index="/life">
              <el-icon><CoffeeCup /></el-icon>
              <span>生活</span>
            </el-menu-item>
            <el-menu-item index="/travel">
              <el-icon><Location /></el-icon>
              <span>旅行</span>
            </el-menu-item>
            <el-menu-item index="/photography">
              <el-icon><Camera /></el-icon>
              <span>摄影</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/about">
            <el-icon><InfoFilled /></el-icon>
            <span>关于</span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-menu-item>
          <el-menu-item index="/write">
            <el-icon><EditPen /></el-icon>
            <span>写文章</span>
          </el-menu-item>
        </el-menu>

        <div class="mobile-user-card">
          <div class="mobile-user-info">
            <el-avatar :size="48" :src="user.avatar_url" />
            <div>
              <div class="mobile-user-name">{{ user.nick_name }}</div>
              <div class="mobile-user-role">高级会员</div>
            </div>
          </div>
          <div class="mobile-user-stats">
            <div class="stat">
              <div class="value">128</div>
              <div class="label">文章</div>
            </div>
            <div class="stat">
              <div class="value">5.6K</div>
              <div class="label">粉丝</div>
            </div>
            <div class="stat">
              <div class="value">24</div>
              <div class="label">收藏</div>
            </div>
          </div>
          <el-button type="danger" text @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-button>
        </div>
      </div>
    </el-drawer> -->
  </div>
  <div class="theme_mode">
    <router-view></router-view>
  </div>
  <!-- <div class="footer">
    <div class="container">
      <p>© 2025 明诺光笺 - 保留所有权利</p>
      <a href="https://beian.miit.gov.cn">鄂ICP备2024072886号-2</a>
    </div>
  </div> -->
</template>

<style scoped lang="scss">
.footer {
  background-color: var(--card-bg);
  color: var(--card-text-1);
  height: 100px;
  padding: 20px 0 10px 0;
  a {
    color: var(--card-text-1);
  }

  p {
    margin-bottom: 5px;
  }

  .container {
    text-align: center;
  }
}

.theme_mode {
  background-color: var(--bg-color);
  color: var(--text-color);
  padding-bottom: 40px;
}

// 定义变量
.header-container {
  height: var(--header-height);
  background-color: var(--header-bg);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.4s ease;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);

  .header-content {
    max-width: 1400px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    position: relative;
    z-index: 2;
  }
}

.dynamic-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  opacity: 0.03;
  z-index: 1;
  transition: opacity 0.5s ease;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;

  .logo-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 32px;
      color: var(--primary-color);
      position: relative;
      z-index: 2;
      transition: transform 0.3s ease;
    }

    .logo-pulse {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(52, 152, 219, 0.2);
      z-index: 1;
      opacity: 0;
    }
  }

  .logo-text {
    font-weight: bold;
    font-size: 1.6rem;
    color: var(--text-color);
    display: flex;
    align-items: center;

    .logo-dot {
      color: var(--accent-color);
      margin: 0 2px;
      animation: pulse 2s infinite;
    }
  }

  &:hover {
    .logo-icon i {
      transform: scale(1.1);
    }

    .logo-pulse {
      animation: pulse 1s ease;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.desktop-nav {
  flex: 1;
  margin: 0 40px;

  .el-menu {
    border-bottom: none;
    height: var(--header-height);
  }

  .el-menu--horizontal {
    justify-content: center;
  }

  .el-menu-item {
    font-weight: 500;
    transition: all 0.3s ease;
    margin: 0 5px;
    border-radius: 8px;

    &:hover {
      background-color: var(--hover-bg) !important;
      transform: translateY(-2px);
    }

    &.is-active {
      color: var(--primary-color) !important;
      font-weight: 600;
    }

    .el-icon {
      margin-right: 8px;
      font-size: 18px;
    }
  }
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 25px;

  .search-container {
    transition: all 0.3s ease;
    background-color: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);

    &.active {
      .search-input {
        width: 260px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
    }

    .search-input {
      width: 200px;
      transition: all 0.3s ease;

      :deep(.el-input__wrapper) {
        border-radius: 30px;
        background-color: var(--hover-bg);
        box-shadow: none;
        border: 1px solid var(--border-color);
        padding: 0 20px;
        height: 40px;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 0 0 1px var(--primary-color) inset;
        }
      }
    }
  }

  .search-popover {
    padding: 15px;

    .popover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    .search-history {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 15px;

      .history-tag {
        cursor: pointer;
        border-radius: 16px;
        padding: 4px 12px;
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        display: flex;
        align-items: center;
        transition: all 0.2s ease;

        &:hover {
          background-color: var(--el-color-primary-light-7);
          transform: translateY(-2px);
        }

        .close-icon {
          margin-left: 6px;
          font-size: 12px;
          opacity: 0.7;

          &:hover {
            opacity: 1;
            color: var(--el-color-danger);
          }
        }
      }
    }

    .suggestion-list {
      .suggestion-item {
        padding: 10px 15px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.2s ease;

        &:hover {
          background-color: var(--el-color-primary-light-9);
          transform: translateX(5px);
        }

        .el-icon {
          margin-right: 10px;
          color: var(--el-text-color-placeholder);
        }

        span {
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  .theme-switch {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
    background-color: var(--hover-bg);

    &:hover {
      background-color: var(--el-color-primary-light-9);
      transform: rotate(15deg);
    }

    .el-icon {
      font-size: 20px;
      color: var(--text-color);
    }
  }

  .notification-bell {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
    position: relative;
    background-color: var(--hover-bg);

    &:hover {
      background-color: var(--el-color-primary-light-9);
      transform: translateY(-2px);

      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .el-icon {
      font-size: 20px;
      color: var(--text-color);
    }

    .badge {
      :deep(.el-badge__content) {
        background-color: var(--accent-color);
        border: 2px solid var(--header-bg);
      }
    }
  }

  .notifications-popover {
    padding: 15px;

    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      h3 {
        margin: 0;
        font-weight: 600;
      }
    }

    .notifications-list {
      max-height: 300px;
      overflow-y: auto;

      .notification-item {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid var(--el-border-color-light);

        &:last-child {
          border-bottom: none;
        }

        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;

          &.comment {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
          }

          &.like {
            background-color: var(--el-color-success-light-9);
            color: var(--el-color-success);
          }

          &.system {
            background-color: var(--el-color-warning-light-9);
            color: var(--el-color-warning);
          }

          .el-icon {
            font-size: 18px;
          }
        }

        .notification-content {
          flex: 1;

          .notification-title {
            font-weight: 500;
            margin-bottom: 4px;
          }

          .notification-time {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }

    .notifications-footer {
      margin-top: 15px;
      text-align: center;
    }
  }

  .user-area {
    display: flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 30px;
    background-color: var(--hover-bg);
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-color);

    &:hover {
      background-color: var(--card-hover-bg);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);

      .user-avatar .online-status {
        background-color: var(--el-color-success);
      }
    }

    .user-avatar {
      position: relative;
      margin-right: 10px;

      .online-status {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--el-color-success-light-5);
        border: 2px solid var(--header-bg);
        transition: all 0.3s ease;
      }
    }

    .user-info {
      .user-name {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 2px;
      }

      .user-role {
        font-size: 12px;
      }
    }
  }

  .user-card {
    padding: 20px;

    .card-header {
      display: flex;
      align-items: center;

      .user-avatar-large {
        position: relative;
        margin-right: 15px;

        .online-status-large {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: var(--el-color-success);
          border: 2px solid var(--bg-color);
        }
      }

      .user-info-large {
        .user-name {
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 4px;
        }

        .user-email {
          font-size: 13px;
        }
      }
    }

    .card-stats {
      display: flex;
      justify-content: space-around;
      padding: 15px 0;

      .stat-item {
        text-align: center;

        .stat-value {
          font-weight: 700;
          font-size: 20px;
          color: var(--primary-color);
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;

      .action-button {
        flex: 1;
        margin: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-icon {
          margin-right: 8px;
        }
      }
    }

    .card-footer {
      text-align: center;
      margin-top: 10px;
    }
  }
}

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 10px;

  .el-icon {
    font-size: 26px;
    color: var(--text-color);
  }
}

.mobile-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}

.mobile-nav {
  .mobile-menu {
    border-right: none;
    padding: 10px 0;

    .el-menu-item,
    .el-sub-menu {
      height: 56px;
      font-size: 16px;

      .el-icon {
        font-size: 20px;
        margin-right: 12px;
      }
    }
  }

  .mobile-user-card {
    padding: 20px;
    border-top: 1px solid var(--el-border-color-light);

    .mobile-user-info {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .el-avatar {
        margin-right: 15px;
      }

      .mobile-user-name {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 4px;
      }

      .mobile-user-role {
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }

    .mobile-user-stats {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;

      .stat {
        text-align: center;

        .value {
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .label {
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .el-button {
      width: 100%;
      justify-content: center;
    }
  }
}

// 响应式设计
@media (max-width: 1100px) {
  .desktop-nav {
    margin: 0 20px;
  }

  .right-actions .search-container.active .search-input {
    width: 220px;
  }
}

@media (max-width: 992px) {
  .desktop-nav {
    display: none;
  }

  .right-actions {
    .search-container:not(.active) .search-input {
      width: 40px;

      :deep(.el-input__wrapper) {
        padding: 0;

        .el-input__inner {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .logo .logo-text {
    font-size: 1.4rem;
  }

  .right-actions {
    .user-area .user-info {
      display: none;
    }

    .notification-bell {
      width: 36px;
      height: 36px;
    }
  }
}

@media (max-width: 576px) {
  .logo .logo-text span:not(.logo-dot) {
    display: none;
  }

  .right-actions {
    gap: 15px;

    .search-container:not(.active) {
      display: none;
    }
  }

  .mobile-menu-btn {
    padding: 8px;
  }
}

// 主题切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
