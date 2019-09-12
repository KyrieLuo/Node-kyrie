// 处理发表评论的业务逻辑
const User = require('../schema/user')
const Article = require('../schema/article')
const Comment = require('../schema/comment')

exports.save = async ctx => {
  const data = ctx.request.body
  data.from = ctx.session.uid
  const datamsg = {
    msg: '未登录，不能评论',
    status: 0
  }
  if (ctx.session.isNew) return ctx.body = datamsg

  await new Comment(data)
    .save().then(data => {
      // 更新文章评论数
      Article
      .update({author: data.from}, 
        {$inc: {commentNum: 1}})
      .then(data => data)
      // 更新用户评论数
      User.update({_id: data.from}, {$inc: {commentNum: 1}})
          .then(data => data)
          .catch(err => err)

      datamsg.msg = '评论成功'
      datamsg.status = 1
    }).catch(err => {
      datamsg.msg = '评论失败'
      datamsg.status = 0
    })

  ctx.body = datamsg
}