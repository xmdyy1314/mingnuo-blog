<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserInfoStore } from '@/stores'
import '@/assets/iconfont/iconfont.css'
import { publishBlogServer } from '@/api/blog'
import router from '@/router'
//是否预览
const isShow = ref<boolean>(false)

//获取富文本编辑器中的文本
const editRef = ref<any>(null) //编辑器中暴露出来的方法

//主要的文本结构  html的字符串格式
const content = ref<string>('')

// 响应式数据
const title = ref<string>('')
const summary = ref<string>('')
//类别
const category = ref('technology')

//禁用按钮，防止重复提交
const isDisabled = ref<boolean>(false)

//发布博客或者保存为草稿箱
const saveBlogContent = async (status: string) => {
  //首先要进行一个校验，不能发布空的东西
  //首先把儿子的文本获取来
  content.value = editRef.value.handleGetContent()
  if (!title.value || !content.value) {
    return ElMessage.error('博客的标题或内容为空！不可发帖')
  }
  isDisabled.value = !isDisabled.value
  try {
    const res = await (
      await publishBlogServer(title.value, summary.value, content.value, status, category.value)
    ).data
    //这里表示博客发布成功了。要进行提示
    //博客发布成功了 直接重定向到详情界面
    setTimeout(() => {
      router.replace({ name: 'detailArticle', params: { id: res.data.blog_id } })
      ElMessage.success('博客发布成功')
      isDisabled.value = !isDisabled.value
    })
  } catch (error: any) {
    ElMessage.error(error.response.data.message)
    isDisabled.value = !isDisabled.value
  }
}

//点击预览的时候就触发一个函数，来显示富文本中的内容
const handlePreview = () => {
  if (editRef.value && !isShow.value) {
    isShow.value = !isShow.value
    content.value = editRef.value.handleGetContent()
    return
  }
  if (isShow.value) {
    isShow.value = !isShow.value
  }
}

//用来处理上传的封面图
const coverImage = ref({
  name: '',
  url: '',
  raw: '',
})

const handleFileChange = (file: any, fileListParam: []) => {
  const originalName = file.name
  const fileExtension = originalName.substring(originalName.lastIndexOf('.') + 1)
  coverImage.value.name = String(Date.now()) + fileExtension
  coverImage.value.url = URL.createObjectURL(file.raw)
  coverImage.value.raw = file.row
}

const tags = ref(['人工智能', '医疗科技', '创新'])
const newTag = ref('')
const coverPreview = ref('')
const featured = ref(true)
const commentable = ref(true)
const notification = ref(true)
const scheduled = ref(false)
const publishDate = ref('')

// 用户信息
const user = ref({
  name: '',
  avatar_url: '',
})

// 计算属性
const wordCount = computed(() => {
  const text = content.value.replace(/<[^>]*>/g, '')
  return text.length > 0 ? Math.round(text.length / 2) : 0
})

const readingTime = computed(() => {
  return Math.max(1, Math.round(wordCount.value / 300))
})

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const formattedPublishDate = computed(() => {
  if (!publishDate.value) return ''
  const date = new Date(publishDate.value)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const isDarkMode = ref<boolean>(false)
//获取用户的信息
const userStore = useUserInfoStore()
onMounted(() => {
  user.value.name = userStore.UserInfo.nick_name
})
</script>

<template>
  <div class="container">
    <header>
      <div class="logo">
        <el-icon style="font-size: 1.8rem"><Edit /></el-icon>
        <h1>创作中心</h1>
      </div>
      <div class="user-actions">
        <button class="btn btn-outline" :disabled="isDisabled" @click="saveBlogContent('草稿')">
          <i class="iconfont icon-baocun"></i> 保存草稿
        </button>
        <button class="btn btn-primary" :disabled="isDisabled" @click="saveBlogContent('待审核')">
          <i class="iconfont icon-fabu"></i> 发布文章
        </button>
      </div>
    </header>

    <div class="main-container">
      <div class="editor-panel">
        <div class="form-group">
          <h2 class="panel-title"><i class="fas fa-heading"></i> 文章标题</h2>
          <input
            type="text"
            class="form-control"
            v-model="title"
            placeholder="输入吸引人的标题..."
          />
        </div>

        <div class="form-group">
          <h2 class="panel-title"><i class="fas fa-image"></i> 封面图片</h2>
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖放图片到此处<em>或点击此处</em></div>
            <template #tip>
              <!-- <div class="el-upload__tip"></div> -->
            </template>
          </el-upload>
        </div>

        <div class="form-group">
          <h2 class="panel-title"><i class="fas fa-align-left"></i> 文章摘要</h2>
          <textarea
            class="form-control"
            v-model="summary"
            rows="3"
            placeholder="输入文章摘要，这将显示在文章列表和社交媒体分享中..."
          ></textarea>
        </div>

        <div class="form-group">
          <h2 class="panel-title"><i class="fas fa-edit"></i> 文章内容</h2>
          <wangEditor ref="editRef"></wangEditor>
        </div>

        <div class="form-group">
          <h2 class="panel-title"><i class="fas fa-folder"></i> 分类</h2>
          <select class="form-control" v-model="category">
            <option value="tech">技术</option>
            <option value="design">设计</option>
            <option value="technology">科技</option>
            <option value="life">生活</option>
            <option value="programming">编程</option>
            <option value="photography">摄影</option>
            <option value="travel">旅行</option>
            <option value="other">其他</option>
          </select>
        </div>

        <!-- <div class="form-group">
          <h2 class="panel-title"><i class="fas fa-tags"></i> 标签</h2>
          <div class="tags-container">
            <div class="tag" v-for="(tag, index) in tags" :key="index">
              {{ tag }} <i class="fas fa-times" @click="removeTag(index)"></i>
            </div>
            <input
              type="text"
              class="tag-input"
              v-model="newTag"
              placeholder="输入标签后按回车..."
              @keyup.enter="addTag"
            />
          </div>
        </div> -->

        <div class="form-group">
          <h2 class="panel-title"><i class="fas fa-cog"></i> 发布设置</h2>
          <div class="options-grid">
            <div class="option-item">
              <input type="checkbox" id="featured" v-model="featured" />
              <label for="featured">设为推荐文章</label>
            </div>
            <div class="option-item">
              <input type="checkbox" id="commentable" v-model="commentable" />
              <label for="commentable">允许评论</label>
            </div>
            <div class="option-item">
              <input type="checkbox" id="notification" v-model="notification" />
              <label for="notification">发送新文章通知</label>
            </div>
            <div class="option-item">
              <input type="checkbox" id="schedule" v-model="scheduled" />
              <label for="schedule">定时发布</label>
            </div>
          </div>
          <div v-if="scheduled" style="margin-top: 15px">
            <label class="form-label">发布日期和时间</label>
            <input type="datetime-local" class="form-control" v-model="publishDate" />
          </div>
        </div>

        <div class="editor-actions">
          <button class="btn btn-secondary" @click="handlePreview">
            <i class="iconfont icon-yulan"></i> 预览
          </button>
          <button class="btn btn-outline"><i class="iconfont icon-daochu"></i> 导出</button>
          <button class="btn btn-primary" :disabled="isDisabled" @click="saveBlogContent('待审核')">
            <i class="iconfont icon-fabu"></i> 发布文章
          </button>
        </div>
      </div>
    </div>

    <div class="preview-panel" v-if="isShow">
      <h2 class="panel-title"><i class="fas fa-eye"></i> 文章预览</h2>
      <div class="preview-content">
        <h1 class="preview-title">{{ title || '文章标题' }}</h1>
        <div class="preview-meta">
          <span><i class="fas fa-user"></i> 作者：{{ user.name }}</span>
          <span><i class="fas fa-calendar"></i> {{ formattedDate }}</span>
          <span><i class="fas fa-folder"></i> {{ category || '未分类' }}</span>
        </div>
        <div class="preview-cover" :class="{ blank: !coverPreview }">
          <img v-if="coverImage.url" :src="coverImage.url" alt="文章封面" />
          <p v-else>封面图片预览区域</p>
        </div>
        <div class="preview-summary" v-if="summary">
          {{ summary }}
        </div>
        <div class="preview-body" v-html="content"></div>
        <div class="preview-tags" v-if="tags.length > 0">
          <div class="preview-tag" v-for="(tag, index) in tags" :key="index">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>

    <div class="status-bar">
      <div class="word-count">
        <i class="fas fa-file-word"></i>
        <span>字数: {{ wordCount }} | 阅读时间: {{ readingTime }}分钟</span>
      </div>
      <div class="publish-status">
        <div class="status-indicator"></div>
        <span class="status-text">已保存</span>
        <div class="schedule-info" :class="{ active: scheduled }">
          <i class="fas fa-clock"></i>
          <span>定时发布: {{ formattedPublishDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  /* background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-text-fill-color: transparent; */
}

.user-actions {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  border: none;
}

.btn-outline {
  background: transparent;
  border: 1px solid #cbd5e0;
  color: #4a5568;
}

.btn-outline:hover {
  background: #f7fafc;
  border-color: #a0aec0;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.main-container {
  display: flex;
  flex: 1;
  gap: 30px;
  margin-bottom: 30px;
}

.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 30px;
  overflow: hidden;
}

.preview-panel {
  flex: 0 0 40rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-title i {
  color: #4f46e5;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #2d3748;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
  background: #f8fafc;
}

.form-control:focus {
  outline: none;
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(199, 210, 254, 0.5);
  background: white;
}

.cover-upload {
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s;
}

.cover-upload:hover {
  border-color: #818cf8;
  background: #eff6ff;
}

.cover-upload i {
  font-size: 2.8rem;
  color: #818cf8;
  margin-bottom: 15px;
}

.cover-upload h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #4f46e5;
}

.cover-upload p {
  color: #718096;
  margin: 5px 0;
  font-size: 0.9rem;
}

.cover-preview {
  margin-top: 20px;
  position: relative;
  display: none;
}

.cover-preview.active {
  display: block;
}

.cover-preview img {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.remove-cover {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-cover:hover {
  transform: scale(1.1);
  background: #b91c1c;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

.tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
}

.tag i {
  margin-left: 8px;
  cursor: pointer;
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.tag i:hover {
  opacity: 1;
}

.tag-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 6px;
  background: transparent;
  font-size: 0.95rem;
  min-width: 100px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-item input {
  width: 20px;
  height: 20px;
  accent-color: #4f46e5;
}

.option-item label {
  font-size: 0.95rem;
  color: #4a5568;
}

.editor-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #edf2f7;
}

.editor-actions .btn {
  flex: 1;
  justify-content: center;
  padding: 14px;
  font-size: 1rem;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.preview-title {
  font-size: 2.1rem;
  margin-bottom: 20px;
  color: #1e293b;
  line-height: 1.3;
  font-weight: 700;
}

.preview-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  color: #64748b;
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.preview-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.preview-cover {
  width: 100%;
  max-height: 250px;
  border-radius: 10px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-cover.blank {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #4f46e5;
  font-weight: 500;
}

.preview-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-summary {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #475569;
  padding: 15px;
  background: #f1f5f9;
  border-radius: 8px;
  margin-bottom: 25px;
  border-left: 3px solid #4f46e5;
}

.preview-body {
  font-size: 1.08rem;
  line-height: 1.8;
  color: #334155;
}

.preview-body p {
  margin-bottom: 20px;
}

.preview-body h2 {
  margin: 30px 0 15px;
  color: #1e293b;
  font-size: 1.6rem;
}

.preview-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 15px 0;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 30px 0 15px;
}

.preview-tag {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: auto;
}

.word-count {
  color: #64748b;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.publish-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
}

.status-text {
  color: #10b981;
  font-weight: 500;
}

.schedule-info {
  display: none;
  align-items: center;
  gap: 8px;
  color: #f59e0b;
  font-size: 0.9rem;
}

.schedule-info.active {
  display: flex;
}

@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }

  .preview-panel {
    flex-basis: auto;
  }
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }

  .editor-actions {
    flex-direction: column;
  }

  header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .user-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
