const { Schema, db } = require('./connect')

// 定义表(集合) 数据格式
const ArticleSchema = new Schema({
  title: String,
  tips: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId, // 关联具体的集合的文档Id
    ref: 'users', // 需要关联的文档Id的集合
  },
  commentNum: {
    type: Number,
    default: 0,
  }
}, {
  versionKey: false,
  timestamps: {createdAt: "created"}
})
// 创建 users表(集合) 并且指定数据格式
const Article = db.model('articles', ArticleSchema)

module.exports = Article