// 处理文章的业务逻辑
const Article = require('../schema/article')
const Comment = require('../schema/comment')
const User = require('../schema/user')

exports.addArticle = async ctx => {

  await ctx.render('add-article', {
    session: ctx.session,
  })
}

exports.add = async ctx => {
  if (ctx.session.isNew) {
    return ctx.body = {
      msg: '请先登录,再发表文章',
      status: 0
    }
  }

  const data = ctx.request.body
  // 将登陆用户的id值传给文章
  data.author = ctx.session.uid
  await new Promise((res, rej) => {

    const acl = new Article(data)

    acl.save((err, data) => {
      if (err) return rej('文章发表失败')
      // 文章发表成功，用户文章发表数+1
      User.update({_id: data.author},{$inc: {articleNum: 1}})
        .then(data => data)
        .catch(err => console.log(err))

      res(data)
    })
  })
  .then( data => {
    ctx.body = {
      msg: '发表成功',
      status: 1
    }
  })
  .catch( data => {
    ctx.body = {
      msg: '发表失败',
      status: 0
    }
  })
}

exports.getlist = async ctx => {
  // 根路由默认显示page=1
  let page = ctx.params.id || 1,
     limit = 2
  page--
  /* 
  * page1 skip0 limit2
  * page2 skip2 limit2
  * page3 skip4 limit2
  */
  let artList = await Article
    .find()
    .limit(limit)
    .skip(limit*page)
    .sort('created') // 参数可以是 可比较的数值类型(时间等) 降序添加'-'
    .populate({
      path: 'author', // 关联当前文章文档的字段，通过该字段查找对应的其他表的字段
      select: 'username avatar'
    })
    .then(data => data)
    .catch(err => err)
  const maxNum = await Article.countDocuments()

  await ctx.render('index', {
    title: "this's title",
    session: ctx.session, // 此时，session可能是有状态的，也可能没有
    artList,
    maxNum
  })
}

exports.detail = async ctx => {
  const _id = ctx.params.id

  const article = await Article
    .findById(_id)
    .populate('author', 'username')
    .then(data => data)

  const comment = await Comment
    .find({article: _id})
    .sort('-created')
    .populate('from', 'username avatar')
    .then(data => data)
    .catch(err => err)
  console.log(comment)

  await ctx.render('article', {
    article,
    comment,
    session: ctx.session
  })
}