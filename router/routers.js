const mongoose = require('mongoose'),
        Router = require('koa-router'),
          user = require('../control/user'),
       article = require('../control/article'),
       comment = require('../control/comment'),
         admin = require('../control/admin'),
        upload = require('../util/upload'),
        router = new Router;


router.get('/', user.keeplog , article.getlist)
// 路由即可 使用string 也可用正则
router.get(/^\/user\/(reg|login)/, async (ctx) => {
  // show 为true 显示注册 false显示登陆
  const show = /reg$/.test(ctx.path)
  await ctx.render('register', {show})
})
// 用户注册
router.post('/user/reg', user.reg)
// 用户登录
router.post('/user/login', user.login)
// 用户退出
router.get('/user/logout', user.logout)
// 文章添加页面
router.get('/article', user.keeplog, article.addArticle)
// 发表文章
router.post('/article', user.keeplog, article.add)
// 获取文章列表
router.get('/page/:id', article.getlist)
// 文章详情页
router.get('/article/:id', user.keeplog, article.detail)
// 提交评论
router.post('/comment', user.keeplog, comment.save)
// 后台管理页
router.get('/admin/:where', admin.index)
// 头像上传
router.post('/upload', user.keeplog, upload.single('file'), user.upload)
// 后台：查看用户评论
router.get('/user/comments', user.keeplog, comment.comlist)
// 后台：删除用户评论
router.post('/comment/:id', user.keeplog, comment.del)


router.get('*', async (ctx) => {
  await ctx.render('404', {
    title: '404'
  })
})

module.exports = router