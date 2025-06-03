<script setup lang="ts">
import { onMounted, ref, defineProps } from 'vue'

// 接受父组件传递过来的博客ID和评论数据
const props = defineProps({
  comment: Object,
})

// 当页面挂载完毕后，调用函数
onMounted(() => {})
</script>

<template>
  <!-- 评论区域 -->
  <div class="comments-section">
    <div class="comment">
      <!-- 评论者信息 -->
      <div class="comment-header">
        <img :src="comment?.avatar" :alt="comment?.nick_name" class="avatar" />
        <span class="nick-name">{{ comment?.nick_name }}</span>
        <span class="created-at">{{ comment?.created_at }}</span>
      </div>
      <!-- 评论内容 -->
      <div class="comment-text">{{ comment?.comment }}</div>
      <!-- 评论操作 -->
      <div class="comment-actions">
        <span class="like-count">👍 {{ comment?.like_count }}</span>
        <span class="reply-count">💬 {{ comment?.reply_count }}</span>
      </div>
      <!-- 子评论 -->
      <div class="replies" v-if="comment?.children && comment.children.length > 0">
        <div class="comment" v-for="(childComment, index) in comment.children" :key="index">
          <div class="comment-header">
            <img :src="childComment?.avatar" :alt="childComment?.nick_name" class="avatar" />
            <span class="nick-name">{{ childComment?.nick_name }}</span>
            <span class="created-at">{{ childComment?.created_at }}</span>
          </div>
          <div class="comment-text">{{ childComment?.comment }}</div>
          <div class="comment-actions">
            <span class="like-count">👍 {{ childComment?.like_count }}</span>
            <span class="reply-count">💬 {{ childComment?.reply_count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.nick-name {
  font-weight: bold;
  margin-right: 10px;
}

.created-at {
  color: #888;
  font-size: 12px;
}

.comment-text {
  margin-bottom: 8px;
  line-height: 1.4;
}

.comment-actions {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 12px;
}

.replies {
  margin-top: 10px;
  margin-left: 20px;
}
</style>
