const { Schema, db } = require('./connect')
const ObjectId = Schema.Types.ObjectId

// 定义表(集合) 数据格式
const CommentSchema = new Schema({
  // 评论用户 头像 内容 时间 评论文章
  content: String,
  from: {
    type: ObjectId,
    ref: 'users'
  },
  article: {
    type: ObjectId,
    ref: 'articles'
  }
}, {
  versionKey: false,
  timestamps: {createdAt: 'created'}, //创建时间
})
// 创建 users表(集合) 并且指定数据格式
const Comment = db.model('comments', CommentSchema)

module.exports = Comment