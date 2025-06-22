<template>
  <el-container class="admin-content">
    <el-main class="admin-main">
      <div class="action-bar">
        <el-button type="primary" @click="openAddPermissionDialog">
          <i class="el-icon-plus"></i> 添加权限
        </el-button>
      </div>

      <el-table :data="permissionList" border style="width: 100%">
        <el-table-column prop="perm_id" label="权限ID" width="100">
          <template #default="scope">
            {{ scope.row.perm_id }}
          </template>
        </el-table-column>
        <el-table-column prop="perm_code" label="权限代码" width="180">
          <template #default="scope">
            <el-tag type="warning">{{ scope.row.perm_code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="权限名称" width="200">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @current-change="getPermissionList"
          v-model:current-page="pageInfo.page"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pageInfo.totalPermissions"
        />
      </div>

      <!-- 添加/编辑权限对话框 -->
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
        <el-form
          :model="permissionForm"
          :rules="formRules"
          ref="permissionFormRef"
          label-width="100px"
        >
          <el-form-item label="权限ID" prop="perm_id" v-if="editMode">
            <el-input v-model="permissionForm.perm_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="权限代码" prop="perm_code">
            <el-input v-model="permissionForm.perm_code"></el-input>
          </el-form-item>
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="permissionForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="permissionForm.description" :rows="3"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="savePermission">保存</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 删除确认对话框 -->
      <el-dialog title="提示" v-model="deleteDialogVisible" width="30%">
        <span>确定要删除权限 {{ deletePermissionName }} 吗？</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="danger" @click="confirmDelete">删除</el-button>
          </span>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getUsersPermissionsServer } from '@/api/admin'

//页码信息
const pageInfo = ref({
  page: 1,
  totalPage: 1,
  total: 10,
  totalPermissions: 0,
})

interface permissionType {
  perm_id: number
  perm_code: string
  name: string
  description: string
}

//权限列表
const permissionList = reactive<permissionType[]>([])

//获取权限列表信息
const getPermissionList = async () => {
  try {
    //请求数据
    const res = (await getUsersPermissionsServer(pageInfo.value.page)).data
    //获取成功了就清楚之前有的
    permissionList.splice(0, permissionList.length)
    res.data.forEach((permission: permissionType) => {
      permissionList.push(permission)
    })
    //更新页码信息
    pageInfo.value.totalPage = res.page_info.totalPages
    pageInfo.value.total = res.page_info.totalPages * 10
    pageInfo.value.totalPermissions = res.page_info.totalPermissions
  } catch (error: any) {
    console.log(error)
    ElMessage.error()
  }
}

// 表格数据
const permissions = ref<permissionType[]>([
  {
    perm_id: 1,
    perm_code: 'BLOG_VIEW',
    name: '博客浏览权限',
    description: '允许用户浏览博客文章',
  },
  {
    perm_id: 2,
    perm_code: 'BLOG_CREATE',
    name: '博客创建权限',
    description: '允许用户创建新的博客文章',
  },
  {
    perm_id: 3,
    perm_code: 'BLOG_EDIT',
    name: '博客编辑权限',
    description: '允许用户编辑博客文章',
  },
  {
    perm_id: 4,
    perm_code: 'BLOG_DELETE',
    name: '博客删除权限',
    description: '允许用户删除博客文章',
  },
  {
    perm_id: 5,
    perm_code: 'USER_MANAGE',
    name: '用户管理权限',
    description: '允许用户管理其他用户账号',
  },
  {
    perm_id: 6,
    perm_code: 'ROLE_MANAGE',
    name: '角色管理权限',
    description: '允许用户管理角色和权限',
  },
  {
    perm_id: 7,
    perm_code: 'SYSTEM_SETTING',
    name: '系统设置权限',
    description: '允许用户修改系统设置',
  },
  {
    perm_id: 8,
    perm_code: 'DATA_EXPORT',
    name: '数据导出权限',
    description: '允许用户导出系统数据',
  },
])

const total = ref(permissions.value.length)
const currentPage = ref(1)
const pageSize = ref(10)

// 对话框相关
const dialogFormVisible = ref(false)
const deleteDialogVisible = ref(false)
const dialogTitle = ref('')
const editMode = ref(false)
const deletePermissionId = ref(0)
const deletePermissionName = ref('')

// 表单相关
const permissionFormRef = ref()
const permissionForm = reactive<permissionType>({
  perm_id: 0,
  perm_code: '',
  name: '',
  description: '',
})

// 表单验证规则
const formRules = reactive({
  perm_code: [{ required: true, message: '请输入权限代码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
})

// 模拟分页数据
const paginatedPermissions = ref([...permissions.value])

// 获取当前页数据
const getCurrentPageData = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  paginatedPermissions.value = permissions.value.slice(start, end)
}

// 打开添加权限对话框
const openAddPermissionDialog = () => {
  dialogTitle.value = '添加权限'
  editMode.value = false
  permissionForm.perm_id = 0
  permissionForm.perm_code = ''
  permissionForm.name = ''
  permissionForm.description = ''
  dialogFormVisible.value = true
}

// 处理编辑操作
const handleEdit = (row: permissionType) => {
  dialogTitle.value = '编辑权限'
  editMode.value = true
  permissionForm.perm_id = row.perm_id
  permissionForm.perm_code = row.perm_code
  permissionForm.name = row.name
  permissionForm.description = row.description
  dialogFormVisible.value = true
}

// 处理删除操作
const handleDelete = (row: permissionType) => {
  deletePermissionId.value = row.perm_id
  deletePermissionName.value = row.name
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  permissions.value = permissions.value.filter(
    (permissionType) => permissionType.perm_id !== deletePermissionId.value,
  )
  total.value = permissions.value.length
  getCurrentPageData()
  deleteDialogVisible.value = false
  ElMessage.success('删除成功')
}

// 保存权限
const savePermission = () => {
  permissionFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (editMode.value) {
        // 编辑模式
        const index = permissions.value.findIndex((p) => p.perm_id === permissionForm.perm_id)
        if (index !== -1) {
          permissions.value.splice(index, 1, { ...permissionForm })
        }
      } else {
        // 添加模式
        const newId = permissions.value.length + 1
        permissions.value.push({
          ...permissionForm,
          perm_id: newId,
        })
      }

      total.value = permissions.value.length
      getCurrentPageData()
      dialogFormVisible.value = false
      ElMessage.success(editMode.value ? '权限更新成功' : '权限添加成功')
    }
  })
}

// 分页相关方法
const handleSizeChange = (size: number) => {
  pageSize.value = size
  getCurrentPageData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  getCurrentPageData()
}

// 初始化分页数据
getCurrentPageData()

onMounted(() => {
  getPermissionList()
})
</script>

<style scoped>
.action-bar {
  margin-bottom: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.admin-content {
  background-color: #f5f7fa;
}
.admin-main {
  background-color: white;
}
</style>
