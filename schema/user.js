const { Schema, db } = require('./connect')
// 定义表(集合) 数据格式
const UserSchema = new Schema({
  username: String,
  password: String,
  avatar: {
    type: String,
    default: '/avatar/default.jpg'
  },
  articleNum: {//用户发表文章数
    type: Number,
    default: 0
  }, 
  commentNum: {// 用户评论数
    type: Number,
    default: 0
  }, 
}, {
  versionKey: false,
})
// 创建 users表(集合) 并且指定数据格式
const User = db.model('users', UserSchema)

module.exports = User