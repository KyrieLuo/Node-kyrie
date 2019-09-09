const mongoose = require('mongoose'),
        Router = require('koa-router'),
        router = new Router;


router.get('/', async (ctx) => {
  await ctx.render('index', {
    title: "this's title"
  })
})
// 路由即可 使用string 也可用正则
router.get(/^\/user\/(reg|login)/, async (ctx) => {
  // show 为true 显示注册 false显示登陆
  const show = /reg$/.test(ctx.path)
  console.log(show)
  await ctx.render('register', {show})
})


module.exports = router