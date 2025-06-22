export interface articleType {
  id: number //文章的id,唯一标识
  cover_image: string //封面图
  type: string //文章的类别即tag
  title: string //文章的标题
  summary: string //文章的摘要
  view_count: number //文章的浏览量
  like_count: number
  publish_time: string
  //作者的信息
  author: {
    id: number
    avatar_url: string
    nick_name: string
  }
}

//接口  博客评论详情
export interface blogCommentType {
  id: number
  blog_id: number
  user_id: number
  parent_id: number
  content: string
  depth: number
  like_count: number
  reply_count: number
  created_at: string
  nick_name: string
  avatar_url: string
  children: blogCommentType[] | null
}
