<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  getBlogListByStatusServer,
  getBlogStatusCountServer,
  getBlogDetailByBlogidServer,
  auditBlogByIdServer,
  getBlogAuditHistoryServer,
} from '@/api/admin'
import { loadFull } from 'tsparticles'

//文章的列表信息展示框
interface blogListType {
  id: number
  title: string
  type: string
  updated_at: string
  status: string
  username: string
}

//文章列表
const blogList = reactive<blogListType[]>([])

// 过滤表单
const filterForm = reactive({
  title: '',
  author: '',
  status: '',
})

//页码的信息
const pageInfo = ref({
  current: 1,
  total: 10,
  page_size: 10,
})

//状态映射表
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

//获取tag类型
const getStatusType = (status: string) => {
  switch (status) {
    case '草稿':
      return 'info'
    case '已发布':
      return 'success'
    case '待审核':
      return 'warning'
    case '已拒绝':
      return 'danger'
    default:
      break
  }
}

//获取文章列表信息，并将其添加到列表中来
const getBlogList = async () => {
  try {
    const res = (
      await getBlogListByStatusServer(
        filterForm.status,
        pageInfo.value.current,
        filterForm.title,
        filterForm.author,
      )
    ).data
    //先将原来的列表信息都清空
    blogList.splice(0, blogList.length)
    //再将请求过来的数据插入进去
    res.data.forEach((item: blogListType) => {
      item.status = statusMap[item.status as keyof typeof statusMap]
      item.type = typeMap[item.type as keyof typeof typeMap]
      blogList.push(item)
    })
    //更新页码信息
    pageInfo.value.total = res.page_info.total_pages * pageInfo.value.page_size
  } catch (error: any) {
    ElMessage.error('获取博客列表信息失败！')
  }
}

// 刷新列表
const refreshList = async () => {
  try {
    await getBlogList()
    ElNotification({
      title: '成功',
      message: '文章列表已刷新',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: '失败',
      message: '文章列表刷新失败',
      type: 'error',
    })
  }
}

interface Article {
  id: number
  title: string
  author: string
  category: string
  createdTime: string
  status: string
  content: string
  reviewHistory?: Array<{
    operator: string
    action: string
    time: string
    comment?: string
  }>
  tags?: string[]
  views?: number
}

//文章的个数信息表
const blogCount = ref({
  total_count: 0,
  draft_count: 0,
  pending_count: 0,
  published_count: 0,
  rejected_count: 0,
})

//获取数量函数
const getBlogCount = async () => {
  try {
    const res = (await getBlogStatusCountServer()).data
    blogCount.value = res
  } catch {
    ElMessage.error('获取博客数量失败！')
  }
}

// 打开审核对话框
const reviewArticle = (blog_id: number) => {
  handleRowClick({ id: blog_id })
}

//选中行的详情信息
const selectedBlog = ref({
  id: 0,
  type: '',
  updated_at: '',
  view_count: 0,
  title: '',
  summary: '',
  content: '',
  author: '',
})

//表格行点击
const handleRowClick = async (row: any) => {
  //先讲表格清空
  Object.assign(auditForm, { blog_id: 0, status: '', reason: '' })
  activeTab.value = 'content'
  try {
    const res = await (await getBlogDetailByBlogidServer(row.id)).data
    auditForm.blog_id = row.id
    reviewDialogVisible.value = true
    selectedBlog.value = res.data
    selectedBlog.value.type = typeMap[selectedBlog.value.type as keyof typeof typeMap]
  } catch {
    ElMessage.error('获取博客详情失败！')
  }
}

//博客的审核
// 审核表单
const auditForm = reactive({
  blog_id: 0,
  status: '',
  reason: '',
})

//提交审核文章函数
const submitAuditBlog = async () => {
  if (!auditForm.status) {
    return ElMessage.error('审核结果状态为空！')
  }
  try {
    await auditBlogByIdServer(auditForm.blog_id, auditForm.status, auditForm.reason)
    //修改信息，修改状态为什么
    blogList.forEach((item) => {
      if (item.id === auditForm.blog_id) {
        item.status = statusMap[auditForm.status as keyof typeof statusMap]
      }
    })
    setTimeout(() => {
      reviewDialogVisible.value = false
      ElMessage.success('博客审核成功')
    }, 1000)
  } catch {
    return ElMessage.error('博客审核失败,稍后重试！')
  }
}

//审核记录接口
interface auditHistoryType {
  blog_id: number
  auditor_id: number
  original_status: string
  new_status: string
  reason: string
  auditor_name: string
  audit_time: string
}

//审核的历史记录展示
const selectBlogHistory = reactive<auditHistoryType[]>([])

const getBlogAuditHistory = async () => {
  selectBlogHistory.splice(0, selectBlogHistory.length)
  try {
    const res = (await getBlogAuditHistoryServer(auditForm.blog_id)).data
    if (res.data.length) {
      //.非空的时候才可以进行赋值操作
      res.data.forEach((item: auditHistoryType) => {
        item.original_status = statusMap[item.original_status as keyof typeof statusMap]
        item.new_status = statusMap[item.new_status as keyof typeof statusMap]
        selectBlogHistory.push(item)
      })
    }
  } catch (error) {
    ElMessage.error('获取历史审核记录错误！')
  }

  //首先清空历史记录
}

const activeTab = ref('content')
// 切换标签页
const handleTabClick = (tab: any) => {
  if (tab.props.name === activeTab.value) {
    return
  }
  activeTab.value = tab.props.name
  if (tab.props.name === 'history') {
    getBlogAuditHistory()
  }
}

// 审核对话框状态
const reviewDialogVisible = ref(false)

// 筛选文章
const handleFilter = async () => {
  // 这里应该是根据过滤条件请求API
  try {
    await getBlogList()
    ElMessage.success('筛选条件已应用')
  } catch (error) {
    ElMessage.error('条件筛选失败！')
  }
}

// 重置筛选
const resetFilter = async () => {
  Object.assign(filterForm, {
    title: '',
    author: '',
    status: '',
  })
  try {
    pageInfo.value.current = 1
    await getBlogList()
    ElMessage.success('筛选条件已重置')
  } catch {
    ElMessage.error('筛选条件重置失败')
  }
}

// 删除文章
// const deleteArticle = (id: number) => {
//   ElMessageBox.confirm('确定要删除这篇文章吗？', '删除确认', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning',
//   })
//     .then(() => {
//       // 模拟删除操作
//       articleList.value = articleList.value.filter((article) => article.id !== id)
//       ElMessage.success('文章已删除')
//       if (selectedArticle.value?.id === id) {
//         reviewDialogVisible.value = false
//       }
//     })
//     .catch(() => {
//       ElMessage.info('操作已取消')
//     })
// }

// 提交审核

// 页面加载时初始化数据
onMounted(() => {
  getBlogCount()
  getBlogList()
})
</script>

<template>
  <div class="blog-review-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <el-row :gutter="20" justify="space-between" align="middle">
            <el-col :span="12">
              <h2>
                待审核文章列表
                <el-tag type="warning" size="small">{{ blogCount.pending_count }}</el-tag>
              </h2>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="refreshList" size="small" icon="Refresh"
                >刷新列表</el-button
              >
            </el-col>
          </el-row>
        </div>
      </template>

      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="filterForm.title"
              placeholder="搜索文章标题"
              clearable
              size="default"
              prefix-icon="Search"
              class="search-input"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="filterForm.author"
              placeholder="搜索作者"
              clearable
              size="default"
              prefix-icon="User"
              class="search-input"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="filterForm.status"
              placeholder="选择状态"
              size="default"
              clearable
              class="search-select"
            >
              <el-option label="待审核" value="pending"></el-option>
              <el-option label="已通过" value="published"></el-option>
              <el-option label="已拒绝" value="rejected"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <div class="search-actions">
              <el-button type="primary" @click="handleFilter" size="default">筛选</el-button>
              <el-button @click="resetFilter" size="default">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="stats-indicators">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-card class="stat-card" :body-style="{ padding: '15px' }">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon color="#409EFF" size="24"><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">总文章数</p>
                  <p class="stat-value">{{ blogCount.total_count }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="stat-card" :body-style="{ padding: '15px' }">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon color="#E6A23C" size="24"><Clock /></el-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">待审核</p>
                  <p class="stat-value">{{ blogCount.pending_count }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="stat-card" :body-style="{ padding: '15px' }">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon color="#67C23A" size="24"><Check /></el-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">已通过</p>
                  <p class="stat-value">{{ blogCount.published_count }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="stat-card" :body-style="{ padding: '15px' }">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon color="#F56C6C" size="24"><Close /></el-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">已拒绝</p>
                  <p class="stat-value">{{ blogCount.rejected_count }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="stat-card" :body-style="{ padding: '15px' }">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon color="#E6A23C" size="24"><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <p class="stat-label">草稿</p>
                  <p class="stat-value">{{ blogCount.draft_count }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="article-list">
        <el-table
          :data="blogList"
          style="width: 100%"
          border
          row-key="id"
          @row-click="handleRowClick"
          :header-cell-style="{ background: '#f5f7fa' }"
          size="default"
        >
          <el-table-column type="index" width="50" label="#" align="center"></el-table-column>
          <el-table-column prop="title" label="文章标题" min-width="220">
            <template #default="scope">
              <el-link type="primary" underline="never">{{ scope.row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="作者用户名"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column prop="type" label="分类" width="120" align="center"></el-table-column>
          <el-table-column
            prop="updated_at"
            label="创建时间"
            width="160"
            align="center"
          ></el-table-column>
          <el-table-column prop="status" label="状态" sortable width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" effect="light">{{
                scope.row.status
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button-group style="justify-content: space-between">
                <el-tooltip content="审核" placement="top">
                  <el-button type="primary" link @click.stop="reviewArticle(scope.row.id)">
                    <el-icon><View /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top">
                  <el-button type="primary" link @click.stop>
                    <el-icon><Edit /></el-icon>
                  </el-button>
                </el-tooltip>
                <!-- <el-tooltip content="删除" placement="top">
                  <el-button type="danger" link @click.stop="deleteArticle(scope.row.id)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip> -->
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-if="pageInfo.total > 10"
            background
            layout="prev, pager, next, jumper"
            :total="pageInfo.total"
            v-model:current-page="pageInfo.current"
            @current-change="getBlogList"
            size="default"
          ></el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 审核详情对话框 -->
    <el-dialog v-model="reviewDialogVisible" align-center title="文章审核" width="70%">
      <div class="review-dialog-content">
        <div class="article-info">
          <h3>{{ selectedBlog.title }}</h3>
          <div v-if="selectedBlog.summary" style="margin-top: 10px">
            <span style="font-weight: 700">文章摘要:</span> {{ selectedBlog.summary }}
          </div>
          <div class="article-meta">
            <span
              ><el-icon><User /></el-icon> {{ selectedBlog.author }}</span
            >
            <span
              ><el-icon><Folder /></el-icon> {{ selectedBlog.type }}</span
            >
            <span
              ><el-icon><Timer /></el-icon> {{ selectedBlog.updated_at }}</span
            >
            <span
              ><el-icon><View /></el-icon> {{ selectedBlog.view_count }} 次浏览</span
            >
          </div>

          <!-- <div class="article-tags">
            <el-tag
              v-for="(tag, index) in selectedArticle.tags"
              :key="index"
              size="small"
              style="margin-right: 8px"
            >
              {{ tag }}
            </el-tag>
          </div> -->
        </div>

        <div class="article-content">
          <el-tabs v-model="activeTab" class="review-tabs" @tab-click="handleTabClick">
            <el-tab-pane label="文章内容" name="content">
              <div class="article-body" v-html="selectedBlog.content"></div>
            </el-tab-pane>
            <el-tab-pane label="审核历史" name="history">
              <div v-if="selectBlogHistory && selectBlogHistory.length > 0">
                <el-timeline>
                  <el-timeline-item
                    v-for="(history, index) in selectBlogHistory"
                    :key="index"
                    :timestamp="history.audit_time"
                    placement="top"
                  >
                    <div class="history-item">
                      <div class="history-header">
                        <span class="history-operator">{{ history.auditor_name }}</span>
                        <span class="history-action"
                          >{{ history.original_status }} <el-icon><Right /></el-icon>
                          {{ history.new_status }}</span
                        >
                      </div>
                      <div class="history-comment">
                        <p v-if="history.reason">{{ history.reason }}</p>
                        <p v-else>无具体意见</p>
                      </div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
              <div v-else class="empty-history">
                <el-empty description="暂无审核历史" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="review-actions">
          <el-form ref="reviewFormRef" :model="auditForm" label-width="100px" size="default">
            <el-form-item label="审核结果">
              <el-radio-group v-model="auditForm.status">
                <el-radio value="published">
                  <el-icon><Check /></el-icon> 通过
                </el-radio>
                <el-radio value="rejected">
                  <el-icon><Close /></el-icon> 拒绝
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item value="审核意见" prop="comment">
              <el-input
                v-model="auditForm.reason"
                type="textarea"
                :rows="3"
                placeholder="请输入审核意见"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <div style="display: flex; justify-content: space-between; width: 100%">
          <el-button @click="reviewDialogVisible = false" size="default">取消</el-button>
          <div>
            <el-button type="primary" @click="submitAuditBlog" size="default">
              <el-icon><UploadFilled /></el-icon> 提交审核
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.blog-review-container {
  padding: 20px;
}

.card-header {
  h2 {
    margin: 0;
    display: inline;
    font-size: 18px;
    font-weight: 600;
  }
}

.filter-section {
  padding: 15px 0;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-actions {
  display: flex;
  gap: 10px;
}

.stats-indicators {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 24px;
  margin-right: 15px;
}

.stat-info {
  text-align: left;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin: 0 0 5px 0;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.article-list {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.review-dialog-content {
  max-height: 600px;
  overflow-y: auto;
}

.article-info {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  color: #606266;
  font-size: 14px;
}

.article-tags {
  margin-top: 10px;
}

.article-content {
  margin-bottom: 20px;
}

.article-body {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  line-height: 1.8;
  overflow-wrap: break-word;
}

.review-tabs {
  margin-top: 20px;
}

.history-item {
  padding: 10px;
  background-color: #fafafa;
  border-radius: 8px;
  margin-bottom: 10px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.history-operator {
  font-weight: bold;
}

.history-comment {
  color: #606266;
  font-size: 14px;
}

.empty-history {
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-table th.el-table__cell {
  background-color: #f5f7fa;
  font-weight: bold;
}

:deep(.el-pagination__sizes) {
  margin-left: 10px;
}

.el-link {
  cursor: pointer;
  font-size: 14px;
}

.el-button-group {
  display: flex;
  gap: 5px;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__body) {
  padding: 20px;
  font-size: 14px;
}

:deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-button) {
  font-size: 14px;
}

:deep(.el-input) {
  font-size: 14px;
}

:deep(.el-select) {
  font-size: 14px;
}

:deep(.el-tag) {
  font-size: 14px;
}

:deep(.el-form) {
  font-size: 14px;
}

:deep(.el-tabs) {
  font-size: 14px;
}

:deep(.el-timeline-item__timestamp) {
  font-size: 14px;
}

:deep(.el-empty__description) {
  font-size: 14px;
}
</style>
