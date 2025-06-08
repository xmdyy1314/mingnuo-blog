export interface articleType {
  id: number //文章的id,唯一标识
  cover_image: string //封面图
  type: string //文章的类别即tag
  title: string //文章的标题
  summary: string //文章的摘要
  view_count: number //文章的浏览量
  publish_time: string
  //作者的信息
  author: {
    avatar_url: string
    nick_name: string
  }
}
