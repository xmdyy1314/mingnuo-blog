import SecureLS from 'secure-ls'

//本地存储加密秘钥
const ls = new SecureLS({
  isCompression: false,
  encryptionSecret: 'MING^_^NUO', // 自定义加密密钥
})

export const SelfStorage = {
  setItem(key: any, value: any) {
    ls.set(key, value)
  },
  getItem(key: any) {
    return ls.get(key)
  },
  remove(key: any) {
    ls.remove(key)
  },
}

export { ls }
