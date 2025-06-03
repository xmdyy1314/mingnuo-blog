<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { activateAuthServer } from '@/api/user'

//激活码
const code = ref<string>('')

//路由
const route = useRoute()

// 背景粒子效果
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

// 激活时的用户名
const username = ref<string>('')

// 激活状态
const isActivated = ref(false)
const loading = ref(false)
const activationError = ref(false)

// 激活账号
const activateAccount = async () => {
  loading.value = true
  activationError.value = false
  try {
    const res = (await activateAuthServer(code.value, username.value)).data
    //在这里用户激活成功了
    isActivated.value = !isActivated.value
  } catch (error: any) {
    loading.value = !loading.value
    activationError.value = !activationError.value
  }
}

// // 重试激活
// const retryActivation = () => {
//   activationError.value = false
//   activateAccount()
// }

// 前往登录
const proceedToLogin = () => {
  // 跳转到登录页面
  router.replace({ name: 'loginView' })
}

// 页面加载完成后初始化
onMounted(() => {
  // 这里可以添加页面初始化逻辑
  code.value = route.params.code as string
})
</script>

<template>
  <div class="activation-container">
    <vue-particles id="tsparticles" :options="options" />
    <div class="activation-card">
      <h1 class="activation-title">激活您的账号</h1>

      <div class="activation-content">
        <div v-if="!isActivated" class="activation-form">
          <p class="activation-description">
            欢迎 <span class="user-highlight">博主</span>，请在下方输入您的账号进行账号激活。
          </p>
          <el-input v-model="username" style="width: 80%" size="large" placeholder="请输入账号" />

          <div v-if="activationError" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span>激活失败，请检查您的账号或稍后再试</span>
          </div>

          <div class="activation-buttons">
            <button
              @click="activateAccount"
              :class="['activate-btn', activationError ? 'error' : '']"
            >
              <i class="fas fa-check-circle" v-if="!loading && !activationError"></i>
              <i class="fas fa-spinner fa-spin" v-else-if="loading"></i>
              <i class="fas fa-times-circle" v-else-if="activationError"></i>
              <span v-if="!loading && !activationError">激活账号</span>
              <span v-else-if="loading">激活中...</span>
              <span v-else-if="activationError">重新激活</span>
            </button>
          </div>
        </div>

        <div v-else class="activation-success">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h2>账号激活成功！</h2>
          <p>您的账号已成功激活，现在可以开始您的博客创作之旅了。</p>

          <div class="success-buttons">
            <button @click="proceedToLogin" class="login-btn">
              <i class="fas fa-sign-in-alt"></i> 前往登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.activation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 30px 20px;
  position: relative;
  z-index: 1;
}

.logo-container {
  margin-bottom: 30px;
  text-align: center;
  animation: float 3s ease-in-out infinite;
}

.logo {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #3498db, #8e44ad);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.logo i {
  animation: pulse 2s infinite;
}

.activation-card {
  background-color: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
}

.activation-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.activation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #3498db, #9b59b6, #e74c3c);
  animation: gradientBar 3s ease infinite;
  background-size: 400% 400%;
}

.activation-title {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 32px;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

.activation-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  border-radius: 2px;
}

.activation-description {
  color: #7f8c8d;
  margin: 25px 0;
  font-size: 18px;
  line-height: 1.6;
}

.user-highlight {
  color: #3498db;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.activation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.activation-buttons {
  display: flex;
  gap: 15px;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.activate-btn {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 30px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 180px;
}

.activate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.5);
  background: linear-gradient(45deg, #2980b9, #3498db);
}

.activate-btn.error {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  box-shadow: 0 6px 15px rgba(231, 76, 60, 0.4);
}

.activate-btn.error:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(231, 76, 60, 0.5);
  background: linear-gradient(45deg, #c0392b, #e74c3c);
}

.activate-btn:active {
  transform: translateY(1px);
}

.activation-success {
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.8s ease;
}

.success-icon {
  margin-bottom: 25px;
  position: relative;
}

.success-icon i {
  font-size: 80px;
  color: #2ecc71;
  animation: bounce 1.2s ease infinite;
}

.success-icon::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(46, 204, 113, 0.1);
  z-index: -1;
  animation: pulseCircle 2s infinite;
}

.activation-success h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 28px;
  animation: slideIn 0.5s ease;
}

.user-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
  animation: slideIn 0.7s ease;
  border-left: 4px solid #3498db;
}

.user-info p {
  margin: 12px 0;
  color: #34495e;
  font-size: 17px;
}

.highlight {
  font-weight: 600;
  color: #3498db;
}

.activation-success p {
  color: #7f8c8d;
  margin-bottom: 30px;
  line-height: 1.6;
  font-size: 17px;
  animation: slideIn 0.9s ease;
}

.success-buttons {
  display: flex;
  gap: 15px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.login-btn {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 15px 30px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
  min-width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.5);
}

.error-message {
  background-color: rgba(255, 99, 99, 0.1);
  border: 1px solid rgba(255, 99, 99, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e74c3c;
  animation: fadeIn 0.8s ease;
}

.error-message i {
  font-size: 20px;
}

.error-message span {
  flex: 1;
  font-size: 15px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes gradientBar {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulseCircle {
  0% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: translateX(-50%) scale(1);
    opacity: 0.3;
  }
  100% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0.7;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-10px);
  }
  40% {
    transform: translateX(10px);
  }
  60% {
    transform: translateX(-10px);
  }
  80% {
    transform: translateX(10px);
  }
}

@media (max-width: 600px) {
  .activation-card {
    padding: 30px 20px;
  }

  .activation-title {
    font-size: 26px;
  }

  .activation-description {
    font-size: 16px;
  }

  .activation-buttons,
  .success-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .activate-btn,
  .login-btn,
  .blog-btn {
    width: 100%;
    padding: 14px;
  }
}
</style>
