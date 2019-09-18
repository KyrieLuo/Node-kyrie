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
      console.log(data)
      Article
      .updateOne({_id: data.article}, 
        {$inc: {commentNum: 1}})
      .then(data => data)
      // 更新用户评论数
      User.updateOne({_id: data.from}, {$inc: {commentNum: 1}})
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

exports.comlist = async ctx => {
  const id = ctx.session.uid
  // 查找当前用户的评论
  const data = await Comment
    .find({from: id})
    .populate('article', 'title')
  
  ctx.body = {
    code: 0,
    count: data.length,
    data
  }
}

exports.del = async ctx => {
  const commentId = ctx.params.id,
    { articleId } = ctx.request.body,
           userId = ctx.session.uid
  // 判断条件
  let isOk = true
  // 删除评论
  await Comment
    .deleteOne({_id:commentId})
    .then(async result => {
      // 文章评论数 -1
      await Article
        .updateOne({_id: articleId}, {$inc: {commentNum: -1}})
      // 用户评论数 -1
      await User
      .updateOne({_id: userId}, {$inc: {commentNum: -1}})
    }).catch(err => {
      isOk = false
    })

    if (isOk) {
      ctx.body = {
        state: 1,
        message: '删除成功!!'
      }
    } else {
      ctx.body = {
        state: 0,
        message: '删除失败!!'
      }
    }
}