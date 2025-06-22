<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { blogCommentType } from '@/types/article'
import { getBlogCommentsByIdServer } from '@/api/blog'
import { agreeBlogOrCommentServer, respondCommentServer } from '@/api/user'
import { useUserInfoStore } from '@/stores'
import router from '@/router'
//要拿到当前用户的头像先
const userStore = useUserInfoStore()

//从父亲接受一个参数，博客的id值，用来获取博客的评论列表
const props = defineProps({
  blogId: {
    type: Number,
    required: true,
  },
})

// 去往个人中心界面
const viewAuthor = (id: number) => {
  const fullPath = router.resolve({ name: 'profileView', params: { userId: id } }).href
  window.open(fullPath, '_blank')
}

//回复评论框显示
const showReplyId = ref<number>(0)

//打开回复评论框的逻辑代码
const openReplyContainer = (id: number) => {
  if (id === showReplyId.value) {
    showReplyId.value = 0
  } else {
    showReplyId.value = id
  }
  newCommentComment.value = ''
}

//评论列表
const commentsList = reactive<blogCommentType[]>([])

//获取评论列表
const getBlogCommentList = async () => {
  try {
    const res = (await getBlogCommentsByIdServer(props.blogId)).data
    res.data.forEach((comment: blogCommentType) => {
      commentsList.push(comment)
    })
  } catch (error: any) {
    ElMessage.error(error.response.data.message)
  }
}

//评论分为两类，一类是评论博客，一类是评论评论
const newBlogComment = ref('')
const newCommentComment = ref('')

const replyToComment = async (blog_id: number, parent_id: number, index: number) => {
  let comment = ''
  if (parent_id === 0) {
    comment = newBlogComment.value
  } else {
    comment = newCommentComment.value
  }
  if (!comment) {
    return
  }
  try {
    const res = (await respondCommentServer(blog_id, parent_id, comment)).data
    if (parent_id === 0) {
      commentsList.unshift({
        id: res.data.id,
        blog_id: res.data.blog_id,
        user_id: res.data.user_id,
        parent_id: res.data.parent_id,
        content: res.data.content,
        depth: res.data.depth,
        like_count: res.data.like_count,
        reply_count: res.data.reply_count,
        created_at: res.data.created_at,
        nick_name: userStore.UserInfo.nick_name,
        avatar_url: userStore.UserInfo.avatar_url,
        children: [],
      })
      emits('addCommentNum')
    } else {
      if (!commentsList[index].children) {
        commentsList[index].children = [] as blogCommentType[]
      }
      commentsList[index].children.unshift({
        id: res.data.id,
        blog_id: res.data.blog_id,
        user_id: res.data.user_id,
        parent_id: res.data.parent_id,
        content: res.data.content,
        depth: res.data.depth,
        like_count: res.data.like_count,
        reply_count: res.data.reply_count,
        created_at: res.data.created_at,
        nick_name: userStore.UserInfo.nick_name,
        avatar_url: userStore.UserInfo.avatar_url,
        children: [],
      })
    }
    newBlogComment.value = ''
    newCommentComment.value = ''
    showReplyId.value = 0
  } catch (error: any) {
    ElMessage.error(error.response.data.message)
  }
}

// 点赞功能
const likeComment = (id: number) => {}

// 回复将回复条数增多传递给老爹
const emits = defineEmits(['addCommentNum'])

//当这个组件被挂载的时候就调用一次
onMounted(() => {
  getBlogCommentList()
})
</script>

<template>
  <div class="comments-container">
    <!-- 评论输入框 -->
    <div class="comment-input-container">
      <div class="user-avatar">
        <img :src="userStore.UserInfo.avatar_url" alt="用户头像" />
      </div>
      <div class="input-area">
        <el-input
          v-model="newBlogComment"
          maxlength="500"
          style="flex: 1"
          :rows="4"
          resize="none"
          :autosize="{ minRows: 3, maxRows: 10 }"
          placeholder="想对作者说点什么..."
          show-word-limit
          type="textarea"
        />
        <ElButton
          type="primary"
          size="small"
          :disabled="!newBlogComment.length"
          @click="replyToComment(blogId, 0, -1)"
          >评论</ElButton
        >
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <div v-if="commentsList.length === 0" class="empty-comments">
        <ElIcon :size="36"><ChatLineRound /></ElIcon>
        <p>还没有评论，快来发表第一条吧！</p>
      </div>

      <div v-for="(comment, index) in commentsList" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <div
            style="display: flex; align-items: center"
            @click="viewAuthor(comment.user_id)"
            class="user-action"
          >
            <img :src="comment.avatar_url" alt="用户头像" class="comment-avatar" />
            <div class="comment-user-info">
              <span class="user-name">{{ comment.nick_name }}</span>
              <span class="comment-time">{{ comment.created_at }}</span>
            </div>
          </div>
          <div style="display: flex">
            <div class="respond_action" @click="openReplyContainer(comment.id)">
              <span class="iconfont icon-pinglun"></span>
              <span style="font-size: 14px; margin-left: 2px">{{
                showReplyId === comment.id ? '收起' : '回复'
              }}</span>
            </div>
            <div class="action" @click="likeComment(comment.id)">
              <span class="iconfont icon-dianzan"></span>
              <span>{{ comment.like_count > 0 ? comment.like_count : '12' }}</span>
            </div>
          </div>
        </div>

        <div class="comment-content">
          {{ comment.content }}
        </div>
        <div class="comment-actions" v-if="showReplyId === comment.id">
          <el-input
            v-model="newCommentComment"
            maxlength="500"
            style="flex: 1"
            :rows="4"
            resize="none"
            :autosize="{ minRows: 3, maxRows: 10 }"
            :placeholder="'回复：' + comment.nick_name"
            show-word-limit
            type="textarea"
          />
          <ElButton
            type="primary"
            size="small"
            :disabled="!newCommentComment.length"
            @click="replyToComment(blogId, comment.id, index)"
          >
            回复
          </ElButton>
        </div>

        <!-- 嵌套回复 -->
        <div v-if="comment.children && comment.children.length" class="replies">
          <div v-for="reply in comment.children" :key="reply.id" class="reply-item">
            <div class="reply-header">
              <div style="display: flex; align-items: center">
                <img :src="reply.avatar_url" alt="用户头像" class="reply-avatar" />
                <div class="reply-user-info">
                  <span class="user-name"
                    >{{ reply.nick_name }} <span>回复 {{ comment.nick_name }}</span></span
                  >
                  <span class="comment-time">{{ reply.created_at }}</span>
                </div>
              </div>
              <div class="reply-actions">
                <div class="action" @click="likeComment(reply.id)">
                  <span class="iconfont icon-dianzan"></span>
                  <span>{{ comment.like_count > 0 ? comment.like_count : '' }}</span>
                </div>
              </div>
            </div>

            <div class="reply-content">
              {{ reply.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-header {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color-light);
  margin-bottom: 20px;
}

.comments-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.comment-input-container {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.input-area {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-area input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 14px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.3s;
}

.input-area input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
}

.comments-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

/* 滚动条样式 */
.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.comment-item {
  margin-top: 15px;
  border-bottom: 1px solid var(--border-color-light);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.user-name {
  font-size: 14px;
  color: var(--text-primary);
}

.user-action:hover {
  cursor: pointer;
  color: var(--card-hover-text);
}

.comment-time {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 2px;
  margin-left: 10px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  padding-left: 48px;
}

.comment-actions {
  display: flex;
  align-items: center;
  padding-left: 48px;
  gap: 15px;
}

.action {
  display: flex;
  align-items: center;
  text-align: right;
  margin-right: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 13px;
  transition: color 0.3s;
}

.action:hover {
  color: var(--primary-color);
}

.action .el-icon {
  margin-right: 5px;
  font-size: 14px;
}

.respond_action {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.respond_action:hover {
  color: var(--like-bg);
  cursor: pointer;
}

/* 回复样式 */
.replies {
  margin-left: 30px;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 0 0 0 12px;
}

.reply-item:not(:last-child) {
  border-bottom: 1px dashed var(--border-color-light);
}

.reply-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.reply-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.reply-content {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: 8px;
  padding-left: 38px;
}

.reply-actions {
  display: flex;
  padding-left: 38px;
}

.empty-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--text-secondary);
}

.empty-comments p {
  margin-top: 15px;
  font-size: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .comments-container {
    padding: 15px;
  }

  .comment-content,
  .comment-actions,
  .reply-content,
  .reply-actions {
    padding-left: 0;
  }

  .replies {
    margin-left: 0;
  }
}
</style>
