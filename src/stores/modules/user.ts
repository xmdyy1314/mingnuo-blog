import { ref } from 'vue'
import { defineStore } from 'pinia'
import { SelfStorage } from './securles'

export const useUserInfoStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const setToken = (newToken: string) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const UserInfo = ref({
      id: '',
      username: '',
      email: '',
      permissions: [],
    })

    const setUserInfo = (id: string, username: string, email: string, permissions: []) => {
      UserInfo.value.id = id
      UserInfo.value.username = username
      UserInfo.value.email = email
      UserInfo.value.permissions = permissions
    }

    return {
      token,
      setToken,
      removeToken,
      UserInfo,
      setUserInfo,
    }
  },
  {
    persist: {
      storage: SelfStorage,
    }, //持久化处理
  },
)
