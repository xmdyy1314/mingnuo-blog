<template>
  <el-container class="admin-layout">
    <!-- 侧边导航栏 -->
    <el-aside width="220px" class="admin-sidebar">
      <div class="logo">
        <img src="/logo.png" alt="Blog Admin" />
        <h1>明诺·光笺 后台系统</h1>
      </div>
      <el-menu
        router
        :default-active="activeIndex"
        class="admin-menu"
        :collapse="isCollapse"
        background-color="#2c3e50"
        text-color="#bfbfbf"
        active-text-color="#409eff"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <span>控制台</span>
        </el-menu-item>

        <el-sub-menu index="blog">
          <template #title>
            <el-icon><Edit /></el-icon>
            <span>博客管理</span>
          </template>
          <el-menu-item index="/admin/blog/list">所有文章</el-menu-item>
          <el-menu-item index="/admin/blog/pending">待审核</el-menu-item>
          <el-menu-item index="/admin/blog/drafts">草稿箱</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="users">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/admin/users/list">用户列表</el-menu-item>
          <el-menu-item index="/admin/users/roles">角色管理</el-menu-item>
          <el-menu-item index="/admin/users/permissions">权限设置</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区域 -->
    <el-container class="admin-content">
      <!-- 顶部导航栏 -->
      <el-header class="admin-header">
        <div class="header-left">
          <el-icon @click="toggleCollapse" class="collapse-icon">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>

        <!-- <div class="header-center">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">控制台</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div> -->

        <div class="header-right">
          <el-dropdown>
            <div class="user-info">
              <!-- <el-badge :value="notifications" class="notification-badge">
                <el-icon><Bell /></el-icon>
              </el-badge> -->
              <el-avatar :size="35" :src="userStore.UserInfo.avatar_url" class="user-avatar" />
              <span class="user-name">{{ userStore.UserInfo.nick_name }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人资料</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserInfoStore } from '@/stores'

const userStore = useUserInfoStore()

// 是否折叠侧边栏
const isCollapse = ref(false)

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 当前路由名称
const route = useRoute()

//当前高亮导航的值
const activeIndex = ref<string>('')

// 待审核文章数量
const pendingCount = ref(5)

// 通知数量
const notifications = ref(3)

// 退出登录
const logout = () => {
  console.log('退出登录')
}

onMounted(() => {
  activeIndex.value = route.path
})
</script>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.admin-sidebar {
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  overflow: hidden;

  .logo {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 15px;
    color: white;
    background-color: #1e2a3a;
    overflow: hidden;

    img {
      height: 30px;
      margin-right: 10px;
    }

    h1 {
      font-size: 16px;
      margin: 0;
      white-space: nowrap;
    }
  }

  .admin-menu {
    flex: 1;
    border: none;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  justify-content: space-between;
}

.header-left {
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.collapse-icon {
  font-size: 18px;
  cursor: pointer;
}

.header-center {
  flex: 1;
  padding: 0 15px;
  max-width: 60%;
}

.header-right {
  width: 200px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .notification-badge {
    margin-right: 15px;
  }

  .user-avatar {
    margin-right: 5px;
  }

  .user-name {
    margin-left: 5px;
    margin-right: 40px;
  }
}

.admin-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

:deep(.el-menu-item.is-active) {
  background-color: #1e2a3a !important;
  border-right: 3px solid #409eff;
}
</style>
