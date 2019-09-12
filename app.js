const Koa = require('koa'),
   router = require('./router/routers'),
   logger = require('koa-logger'),
      pug = require('pug'),
     body = require('koa-body'),
   { db } = require('./schema/connect'),
  session = require('koa-session'),
   static = require('koa-static'),
    views = require('koa-views'),
      app = new Koa;
const { join } = require('path')

app.keys = ['kyrie sign']
const CONFIG = {
  key: 'Sid',
  maxAge: 36e5, // 3600000 -> 36e5 一小时
  overwrite: true,
  httpOnly: true, // 客户端是否可查询
  // signed: true, // 签名 --> 需要对应的密钥 app.keys
  rolling: true,
}

// app.use(logger())
app.use(session(CONFIG, app))
// 设置渲染模板引擎
app.use(views(join(__dirname, 'views'), {
  extension: 'pug'
}))
// 设置静态资源目录
app.use(static(join(__dirname, 'public')))
// 注册body中间件，解析post数据
app.use(body())

// 注册路由信息
app.use(router.routes()).use(router.allowedMethods())
// 监听端口
app.listen(3000, () => {console.log('app is running')})