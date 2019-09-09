const Koa = require('koa'),
   router = require('./router/routers'),
   logger = require('koa-logger'),
      pug = require('pug'),
   static = require('koa-static'),
    views = require('koa-views'),
      app = new Koa;
const { join } = require('path')

app.use(logger())
// 设置渲染模板引擎
app.use(views(join(__dirname, 'views'), {
  extension: 'pug'
}))
// 设置静态资源目录
app.use(static(join(__dirname, 'public')))


// 注册路由信息
app.use(router.routes()).use(router.allowedMethods())
// 监听端口
app.listen(3000, () => {console.log('app is running')})