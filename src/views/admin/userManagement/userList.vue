<template>
  <el-container class="admin-content">
    <el-main class="admin-main">
      <!-- 搜索安全过滤栏 -->
      <div class="action-bar">
        <el-input
          v-model="searchQuery"
          placeholder="输入用户名或角色名搜索"
          clearable
          style="width: 300px; margin-right: 10px"
        />
        <el-button type="primary" @click="handleSearch">
          <i class="el-icon-search"></i> 搜索功能实现
        </el-button>
        <el-button type="success" @click="handleBatchAssign">
          <i class="el-icon-check"></i> 批量分配角色
        </el-button>
      </div>

      <!-- 用户表格 -->
      <el-table
        ref="userTableRef"
        :data="userList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="user_id" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
        <el-table-column prop="roles" label="已分配角色" min-width="200">
          <template #default="scope">
            <el-tag
              v-for="role in scope.row.roles"
              :key="role.id"
              type="info"
              style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ role.role_name }}
            </el-tag>
            <span v-if="!scope.row.roles || scope.row.roles.length === 0">无角色</span>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time" label="最后登录时间" width="180"> </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="default" type="primary" @click="handleAssignRoles(scope.row)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="getUserList"
          @current-change="getUserList"
          v-model:current-page="pageInfo.current"
          :page-sizes="[10, 20, 50, 100]"
          v-model:page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.totalUsers"
        />
      </div>

      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" v-model="assignRoleDialogVisible" width="50%">
        <el-form :model="assignForm" label-width="100px">
          <el-form-item label="用户信息">
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户ID" :label-width="'120px'">
                  {{ selectedUser?.user_id }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户名" :label-width="'120px'">
                  {{ selectedUser?.username }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="可用角色">
            <el-select
              v-model="assignForm.roleIds"
              multiple
              placeholder="请选择角色"
              style="width: 100%"
            >
              <el-option
                v-for="role in roles"
                :key="role.role_id"
                :label="role.role_name"
                :value="role.role_id"
              >
                <span style="float: left">{{ role.role_name }}</span>
                <el-tag v-if="role.is_system" type="success" style="float: right; margin-left: 10px"
                  >系统</el-tag
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="assignRoleDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveRoleAssignments">保存</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 批量分配角色对话框 -->
      <el-dialog title="批量分配角色" v-model="batchAssignDialogVisible" width="50%">
        <el-form :model="batchAssignForm" label-width="120px">
          <el-form-item label="选择角色">
            <el-select
              v-model="batchAssignForm.roleId"
              placeholder="请选择角色"
              style="width: 100%"
            >
              <el-option
                v-for="role in roles"
                :key="role.role_id"
                :label="role.role_name"
                :value="role.role_id"
              >
                <span style="float: left">{{ role.role_name }}</span>
                <el-tag v-if="role.is_system" type="success" style="float: right; margin-left: 10px"
                  >系统</el-tag
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="batchAssignDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveBatchRoleAssignments">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { getUserListServer } from '@/api/admin'
import { SortDown } from '@element-plus/icons-vue'

//用户列表
interface userType {
  user_id: number
  username: string
  nick_name: string
  email: string
  last_login_time: string
  roles: []
}

//页码信息
const pageInfo = ref({
  current: 1,
  pageSize: 10,
  totalPages: 1,
  totalUsers: 0,
})

const userList = reactive<userType[]>([])

const getUserList = async () => {
  try {
    //获取信息
    const res = (await getUserListServer(pageInfo.value.current, pageInfo.value.pageSize)).data
    userList.splice(0, userList.length)
    res.data.forEach((user: userType) => {
      userList.push(user)
    })
    pageInfo.value.pageSize = res.page_info.pageSize
    pageInfo.value.totalPages = res.page_info.totalPages
    pageInfo.value.totalUsers = res.page_info.totalUsers
  } catch (error: any) {
    ElMessage.error(error.response.data.error)
  }
}

interface Role {
  role_id: number
  role_name: string
  is_system: boolean
}

interface User {
  user_id: number
  username: string
  email: string
  roles: Array<{ id: number; name: string }>
  last_login: Date | null
}

// 模拟数据
const users = ref<User[]>([
  {
    user_id: 1,
    username: 'admin',
    email: 'admin@example.com',
    roles: [{ id: 1, name: '超级管理员' }],
    last_login: new Date('2025-04-01T10:00:00'),
  },
  {
    user_id: 2,
    username: 'content_editor',
    email: 'editor@example.com',
    roles: [{ id: 2, name: '内容编辑' }],
    last_login: new Date('2025-04-02T11:30:00'),
  },
  {
    user_id: 3,
    username: 'data_analyst',
    email: 'analyst@example.com',
    roles: [{ id: 3, name: '数据分析师' }],
    last_login: new Date('2025-04-03T14:15:00'),
  },
  {
    user_id: 4,
    username: 'normal_user',
    email: 'user@example.com',
    roles: [],
    last_login: new Date('2025-04-04T09:45:00'),
  },
  {
    user_id: 5,
    username: 'new_member',
    email: 'new@example.com',
    roles: [],
    last_login: null,
  },
])

const roles = ref<Role[]>([
  { role_id: 1, role_name: '超级管理员', is_system: true },
  { role_id: 2, role_name: '内容编辑', is_system: false },
  { role_id: 3, role_name: '数据分析师', is_system: false },
  { role_id: 4, role_name: '普通用户', is_system: false },
  { role_id: 5, role_name: '客服代表', is_system: false },
])

// 筛选和分页
const searchQuery = ref('')
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(
    (user) =>
      user.username.includes(searchQuery.value) ||
      (user.email && user.email.includes(searchQuery.value)) ||
      user.roles.some((role) => role.name.includes(searchQuery.value)),
  )
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => filteredUsers.value.length)

// 对话框相关
const assignRoleDialogVisible = ref(false)
const batchAssignDialogVisible = ref(false)
const selectedUser = ref<User | null>(null)
const selectedUsers = ref<User[]>([])

// 表单相关
const assignForm = reactive({
  roleIds: [] as number[],
})

const batchAssignForm = reactive({
  roleId: null as number | null,
})

// 表格多选
const userTableRef = ref()
const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

// 搜索按钮
const handleSearch = () => {
  // 这里可以添加搜索逻辑
  currentPage.value = 1
}

// 分配角色按钮
const handleAssignRoles = (user: User) => {
  selectedUser.value = user
  assignForm.roleIds = user.roles.map((role) => role.id)
  assignRoleDialogVisible.value = true
}

// 批量分配角色按钮
const handleBatchAssign = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请至少选择一个用户')
    return
  }
  batchAssignDialogVisible.value = true
}

// 保存角色分配
const saveRoleAssignments = () => {
  // if (!selectedUser.value) return
  // // 更新用户的角色
  // const userIndex = users.value.findIndex((u) => u.user_id === selectedUser.value.user_id)
  // if (userIndex !== -1) {
  //   users.value[userIndex].roles = roles.value.filter((role) =>
  //     assignForm.roleIds.includes(role.role_id),
  //   )
  // }
  // assignRoleDialogVisible.value = false
  // ElMessage.success('角色分配成功')
}

// 保存批量角色分配
const saveBatchRoleAssignments = () => {
  // if (!batchAssignForm.roleId) {
  //   ElMessage.warning('请选择一个角色')
  //   return
  // }
  // selectedUsers.value.forEach((user) => {
  //   // 更新用户的角色
  //   const userIndex = users.value.findIndex((u) => u.user_id === user.user_id)
  //   if (userIndex !== -1) {
  //     users.value[userIndex].roles = [
  //       ...users.value[userIndex].roles,
  //       {
  //         id: batchAssignForm.roleId,
  //         name: roles.value.find((r) => r.role_id === batchAssignForm.roleId)?.role_name || '',
  //       },
  //     ]
  //   }
  // })
  // batchAssignDialogVisible.value = false
  // ElMessage.success('批量角色分配成功')
}

//页面挂载完成之后
onMounted(() => {
  getUserList()
})
</script>

<style scoped>
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f5f7fa;
}

.role-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
