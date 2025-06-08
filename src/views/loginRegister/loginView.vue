<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { loginAuthServer, registerAuthServer } from '@/api/user'
import { useUserInfoStore } from '@/stores/modules/user'
import router from '@/router'

// 登录注册状态
const isLogin = ref(true)
const loading = ref(false)

//背景粒子效果
const options = ref({
  background: {
    color: {
      value: '#1a2a6c', // 背景颜色，与激活面板的主色调相协调
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: false,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'grab',
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: '#ffffff', // 粒子颜色，与激活面板的文字颜色相协调
    },
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'bounce',
      },
      random: false,
      speed: 4,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800, // 调整粒子密度，使其更丰富
      },
      value: 100, // 增加粒子数量
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 0.5, max: 3 }, // 调整粒子大小范围，使其更细腻
    },
  },
  detectRetina: true,
})

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
})
//初始化登录框
const initLoginForm = () => {
  //清除登录
  loginForm.username = ''
  loginForm.password = ''
  loginFormRef.value?.clearValidate()
  isLogin.value = !isLogin.value
}

// 登录表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 8, max: 13, message: '用户名长度应在 8 到 13 个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 15, message: '密码长度应在 8 到 15 个字符之间', trigger: 'blur' },
  ],
})

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})
//初始化注册表单
const initRegisterForm = () => {
  //清楚校验
  registerForm.username = ''
  ;(registerForm.email = ''), (registerForm.password = '')
  registerForm.confirmPassword = ''
  registerFormRef.value?.clearValidate()
  isLogin.value = !isLogin.value
}

// 注册表单验证规则
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 8, max: 13, message: '用户名长度应在 8 到 13 个字符之间', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 15, message: '密码长度应在 8 到 15 个字符之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 登录表单引用
const loginFormRef = ref<FormInstance>()
// 注册表单引用
const registerFormRef = ref<FormInstance>()

// 处理登录
const userStore = useUserInfoStore()
const handleLogin = async () => {
  //先进行初次的预校验
  if (!loginFormRef.value) {
    return ElMessage('登录状态错误！')
  }
  await loginFormRef.value.validate()
  try {
    //发送登录请求
    const res = (await loginAuthServer(loginForm.username, loginForm.password)).data
    userStore.setToken(res.token)
    //将个人信息的用户名以及邮箱都存进去
    userStore.setUserInfo(
      res.user.id,
      res.user.username,
      res.user.nick_name,
      res.user.email,
      res.user.avatar_url,
      res.user.permissions,
    )
    router.replace({ name: 'indexView' })
    ElMessage.success('登录成功！')
  } catch (error: any) {
    ElMessage.error(error.response.data.error)
  }
}

// 处理注册
const handleRegister = async () => {
  //先进行初次的预校验
  if (!registerFormRef.value) {
    return ElMessage('登录状态错误！')
  }
  await registerFormRef.value.validate()
  try {
    await registerAuthServer(registerForm.username, registerForm.password, registerForm.email)
    ElMessage.success('注册成功,注意查收邮箱激活账号！')
  } catch (error: any) {
    console.log(error)

    ElMessage.error(error.response.data.error)
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 背景粒子效果 -->
    <vue-particles id="tsparticles" :options="options" />

    <!-- 3D卡片容器 -->
    <div class="card-container" :class="{ flipped: !isLogin }">
      <!-- 登录卡片 -->
      <div class="card login-card">
        <div class="logo">
          <div class="logo-icon">B</div>
          <h1>博客空间</h1>
        </div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="form"
          @submit.prevent="handleLogin"
          size="large"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="账号" prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btn login-btn" @click="handleLogin" :loading="loading"
              >登录</el-button
            >
          </el-form-item>
          <div class="switch-text"><span @click="initRegisterForm">还没有账号？立即注册</span></div>
        </el-form>
      </div>

      <!-- 注册卡片 -->
      <div class="card register-card">
        <div class="logo">
          <div class="logo-icon">B</div>
          <h1>加入我们</h1>
        </div>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="form"
          @submit.prevent="handleRegister"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="账号"
              prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              type="email"
              placeholder="邮箱"
              prefix-icon="Message"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              prefix-icon="Check"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              class="btn register-btn"
              @click="handleRegister"
              :loading="loading"
              >注册</el-button
            >
          </el-form-item>
          <div class="switch-text"><span @click="initLoginForm"> 已有账号？立即登录</span></div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 粒子背景样式 */
#tsparticles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.card-container {
  width: 100%;
  max-width: 400px;
  height: 550px;
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1;
}

.card-container.flipped {
  transform: rotateY(180deg);
}

.card {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.login-card {
  z-index: 2;
}

.register-card {
  transform: rotateY(180deg);
  z-index: 1;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.logo-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.logo-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(106, 17, 203, 0.4);
}

.logo h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

:deep(.el-form-item) {
  margin-bottom: 4px;
}

:deep(.el-input) {
  width: 100%;
}

:deep(.el-input__inner) {
  border-radius: 50px !important;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-size: 14px; /* 增大字体大小 */
  padding-left: 20px !important; /* 增加左内边距 */
  height: 40px; /* 增加高度 */
}

:deep(.el-input__inner:focus) {
  box-shadow: 0 2px 15px rgba(106, 17, 203, 0.3);
  outline: none;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #555;
}

:deep(.el-checkbox__label a) {
  color: #6a11cb;
  text-decoration: none;
  margin: 0 5px;
}

:deep(.el-checkbox__label a:hover) {
  text-decoration: underline;
}

:deep(.el-button) {
  width: 100%;
  border-radius: 50px !important;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.login-btn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(106, 17, 203, 0.4);
}

.register-btn {
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  color: white;
}

.register-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 65, 108, 0.4);
}

.switch-text {
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-text:hover {
  color: #2575fc;
  text-decoration: underline;
}
</style>
