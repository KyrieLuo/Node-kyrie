// 后台控制数据库
const Article = require('../schema/article'),
      Comment = require('../schema/comment'),
         User = require('../schema/user'),
           fs = require('fs'),
     { join } = require('path')


exports.index = async ctx => {
  if (ctx.session.isNew) {
    return ctx.body = 'you are not sign in'
  }
  const where = ctx.params.where
  const arr = fs.readdirSync(join(__dirname, '../views/admin'))
  
  let flag = false
  // 在循环内部不能操作异步
  arr.forEach(v => {
    const name = v.replace(/^(admin-)|(\.pug)$/g, '')
    if (name === where) {
      flag = true
    }
  })

  if (flag) {
    await ctx.render(`admin/admin-${where}.pug`, {
      role: ctx.session.role
    })
  } else {

    await ctx.render('404', {
      title: '页面不存在'
    })
  }

}