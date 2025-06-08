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
      nick_name: '',
      email: '',
      avatar_url: '',
      permissions: [],
    })

    const setUserInfo = (
      id: string,
      username: string,
      nick_name: string,
      email: string,
      avatar_url: string,
      permissions: [],
    ) => {
      UserInfo.value.id = id
      UserInfo.value.username = username
      UserInfo.value.nick_name = nick_name
      UserInfo.value.email = email
      UserInfo.value.avatar_url = avatar_url
      UserInfo.value.permissions = permissions
    }
    //清空个人表
    const clearUserInfo = () => {
      UserInfo.value.id = ''
      UserInfo.value.username = ''
      UserInfo.value.nick_name = ''
      UserInfo.value.email = ''
      UserInfo.value.avatar_url = ''
      UserInfo.value.permissions = []
    }

    return {
      token,
      setToken,
      removeToken,
      UserInfo,
      setUserInfo,
      clearUserInfo,
    }
  },
  {
    persist: {
      storage: SelfStorage,
    }, //持久化处理
  },
)
