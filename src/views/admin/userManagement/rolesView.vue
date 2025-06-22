<template>
  <el-container class="admin-content">
    <el-main class="admin-main">
      <!-- 操作栏 -->
      <div class="action-bar">
        <el-button type="primary" @click="openAddRoleDialog">
          <i class="el-icon-plus"></i> 添加角色
        </el-button>
        <el-button @click="handleExport"> <i class="el-icon-download"></i> 导出 </el-button>
        <el-button @click="handleImport"> <i class="el-icon-upload2"></i> 导入 </el-button>
      </div>

      <!-- 角色表格 -->
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="role_id" label="角色ID" width="100">
          <template #default="scope">
            {{ scope.row.role_id }}
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="角色名称" width="200">
          <template #default="scope">
            {{ scope.row.role_name }}
          </template>
        </el-table-column>
        <el-table-column prop="is_system" label="是否系统" width="120" sortable>
          <template #default="scope">
            <el-tag :type="scope.row.is_system === '1' ? 'success' : 'info'">
              {{ scope.row.is_system === '1' ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180"> </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleAssignPermissions(scope.row)"
              >分配权限</el-button
            >
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>

      <!-- 添加/编辑角色对话框 -->
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
        <el-form :model="roleForm" :rules="formRules" ref="roleFormRef" label-width="100px">
          <el-form-item label="角色ID" prop="role_id" v-if="editMode">
            <el-input v-model="roleForm.role_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="roleForm.role_name"></el-input>
          </el-form-item>
          <el-form-item label="是否系统" prop="is_system">
            <el-switch v-model="roleForm.is_system" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="roleForm.description" :rows="3"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="saveRole">保存</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" v-model="assignPermissionDialogVisible">
        <el-form label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="selectedRole.role_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="权限列表">
            <el-tree
              ref="permTreeRef"
              :data="permissions"
              show-checkbox
              node-key="perm_id"
              :props="{ label: 'name', children: 'children' }"
            ></el-tree>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="assignPermissionDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="savePermissions">保存</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 删除确认对话框 -->
      <el-dialog title="提示" v-model="deleteDialogVisible" width="30%">
        <span>确定要删除角色 {{ deleteRoleName }} 吗？</span>
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
import { getRoleListServer } from '@/api/admin'

//页码信息
const pageInfo = ref({
  currentPage: 1,
  totalPages: 1,
  totalRoles: 0,
  pageSize: 10,
})

//角色列表
interface roleType {
  role_id: number
  role_name: string
  description: string
  is_system: string
  created_at: string
}

const roleList = reactive<roleType[]>([])

const getRoleList = async () => {
  try {
    const res = (await getRoleListServer(pageInfo.value.currentPage)).data
    roleList.splice(0, roleList.length)
    for (const role of res.data) {
      roleList.push(role)
    }
    pageInfo.value.totalPages = res.page_info.totalPages
    pageInfo.value.totalRoles = res.page_info.totalRoles
  } catch (error: any) {}
}

interface Permission {
  perm_id: number
  name: string
  children?: Permission[]
}

interface Role {
  role_id: number
  role_name: string
  is_system: boolean
  description: string
  created_at: Date
  permissions: Permission[]
}

const roles = ref<Role[]>([
  {
    role_id: 1,
    role_name: '超级管理员',
    is_system: true,
    description: '拥有系统的全部权限',
    created_at: new Date('2023-01-01T00:00:00'),
    permissions: [],
  },
  {
    role_id: 2,
    role_name: '内容管理员',
    is_system: false,
    description: '负责内容管理和审核',
    created_at: new Date('2023-02-15T00:00:00'),
    permissions: [],
  },
  {
    role_id: 3,
    role_name: '普通用户',
    is_system: false,
    description: '只拥有基本权限',
    created_at: new Date('2023-03-10T00:00:00'),
    permissions: [],
  },
  {
    role_id: 4,
    role_name: '客服代表',
    is_system: false,
    description: '负责客户服务相关工作',
    created_at: new Date('2023-04-22T00:00:00'),
    permissions: [],
  },
  {
    role_id: 5,
    role_name: '数据分析师',
    is_system: false,
    description: '负责数据分析和报告',
    created_at: new Date('2023-05-05T00:00:00'),
    permissions: [],
  },
])

const permissions = ref<Permission[]>([
  {
    perm_id: 1,
    name: '博客管理',
    children: [
      { perm_id: 11, name: '查看文章' },
      { perm_id: 12, name: '编辑文章' },
      { perm_id: 13, name: '删除文章' },
      { perm_id: 14, name: '发布文章' },
    ],
  },
  {
    perm_id: 2,
    name: '用户管理',
    children: [
      { perm_id: 21, name: '查看用户' },
      { perm_id: 22, name: '编辑用户' },
      { perm_id: 23, name: '删除用户' },
      { perm_id: 24, name: '添加用户' },
    ],
  },
  {
    perm_id: 3,
    name: '系统设置',
    children: [
      { perm_id: 31, name: '查看设置' },
      { perm_id: 32, name: '修改设置' },
    ],
  },
])

const total = ref(roles.value.length)
const currentPage = ref(1)
const pageSize = ref(10)

// 对话框相关
const dialogFormVisible = ref(false)
const assignPermissionDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const dialogTitle = ref('')
const editMode = ref(false)
const deleteRoleId = ref(0)
const deleteRoleName = ref('')

// 表单相关
const roleFormRef = ref()
const permTreeRef = ref()
const roleForm = reactive<Role>({
  role_id: 0,
  role_name: '',
  is_system: false,
  description: '',
  created_at: new Date(),
  permissions: [],
})

// 当前选中的角色
const selectedRole = ref<Role>({
  role_id: 0,
  role_name: '',
  is_system: false,
  description: '',
  created_at: new Date(),
  permissions: [],
})

// 表单验证规则
const formRules = reactive({
  role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  is_system: [{ required: true, message: '请选择是否系统角色', trigger: 'change' }],
})

// 模拟分页数据
const paginatedRoles = ref([...roles.value])

// 获取当前页数据
const getCurrentPageData = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  paginatedRoles.value = roles.value.slice(start, end)
}

// 打开添加角色对话框
const openAddRoleDialog = () => {
  dialogTitle.value = '添加角色'
  editMode.value = false
  roleForm.role_id = 0
  roleForm.role_name = ''
  roleForm.is_system = false
  roleForm.description = ''
  roleForm.created_at = new Date()
  dialogFormVisible.value = true
}

// 处理编辑操作
const handleEdit = (row: Role) => {
  dialogTitle.value = '编辑角色'
  editMode.value = true
  roleForm.role_id = row.role_id
  roleForm.role_name = row.role_name
  roleForm.is_system = row.is_system
  roleForm.description = row.description
  roleForm.created_at = row.created_at
  dialogFormVisible.value = true
}

// 处理删除操作
const handleDelete = (row: Role) => {
  deleteRoleId.value = row.role_id
  deleteRoleName.value = row.role_name
  deleteDialogVisible.value = true
}

// 处理分配权限操作
const handleAssignPermissions = (row: Role) => {
  selectedRole.value = { ...row }
  // 模拟加载角色已有的权限
  selectedRole.value.permissions = row.permissions

  // 设置树状选择器的选中状态
  if (permTreeRef.value) {
    permTreeRef.value.setCheckedKeys(selectedRole.value.permissions.map((p) => p.perm_id))
  }

  assignPermissionDialogVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  roles.value = roles.value.filter((role) => role.role_id !== deleteRoleId.value)
  total.value = roles.value.length
  getCurrentPageData()
  deleteDialogVisible.value = false
  ElMessage.success('删除成功')
}

// 保存角色
const saveRole = () => {
  roleFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (editMode.value) {
        // 编辑模式
        const index = roles.value.findIndex((role) => role.role_id === roleForm.role_id)
        if (index !== -1) {
          roles.value.splice(index, 1, { ...roleForm })
        }
      } else {
        // 添加模式
        const newId = roles.value.length + 1
        roles.value.push({
          ...roleForm,
          role_id: newId,
        })
      }

      total.value = roles.value.length
      getCurrentPageData()
      dialogFormVisible.value = false
      ElMessage.success(editMode.value ? '角色更新成功' : '角色添加成功')
    }
  })
}

// 保存权限分配
const savePermissions = () => {
  if (!permTreeRef.value) return

  const checkedKeys = permTreeRef.value.getCheckedKeys()
  selectedRole.value.permissions = permissions.value.flatMap((permission) => {
    if (checkedKeys.includes(permission.perm_id)) {
      // 如果父权限被选中，则自动选中所有子权限
      return [permission, ...(permission.children || [])]
    }
    return permission.children?.filter((child) => checkedKeys.includes(child.perm_id)) || []
  })

  assignPermissionDialogVisible.value = false
  ElMessage.success('权限分配成功')
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

// 处理导出
const handleExport = () => {
  console.log('导出角色数据')
  ElMessage.success('导出成功')
}

// 处理导入
const handleImport = () => {
  console.log('导入角色数据')
  ElMessage.success('导入成功')
}

// 格式化日期
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 初始化分页数据
getCurrentPageData()

onMounted(() => {
  getRoleList()
})
</script>

<style scoped>
.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f5f7fa;
}
</style>
