import { createApp } from 'vue'
import Particles from '@tsparticles/vue3'
import { loadFull } from 'tsparticles'
import pinia from './stores'
import '@/styles/element.css'
import '@/styles/base.css'
import '@/styles/theme.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Particles, {
  init: async (engine) => {
    await loadFull(engine)
  },
})

//挂载element的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)

app.mount('#app')
