// 处理注册 和 登录的业务逻辑
const User = require('../schema/user')
// 导入加密函数
const encrypt = require('../util/encrypt')

exports.reg = async (ctx) => {
  const { username, password, confirmPWD } = ctx.request.body
  
  await new Promise((res, rej) => {
    // 因为是查找操作，属于I/O
    User.find({username}, (err, data) => {
      // 报错 rej
      if (err)return rej('数据查找失败')
      if (data.length !== 0) { // 用户已存在
        return res('')
      }
      // 用户不存在, 保存用户信息
      const _user = new User({
        username,
        password: encrypt(password)
      })
      //保存
      _user.save((err, data) => {
        // 保存失败 rej
        if (err)return rej('注册失败')
        res(data)
      })
    })
    
  })
  .then(async (data) => {
    if (data === '') { // 用户已存在
      await ctx.render('isOk', {
        status: '用户已存在'
      })
    } else {
      await ctx.render('isOk', {
        status: '用户注册成功~!'
      })
    }
  })
  .catch(async (status) => {
    await ctx.render('isOk', {status})
  })
}

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body

  await new Promise((res, rej) => {

    User.find({username}, (err, data) => {
      if (err) return rej(err)
      if ( data.length === 0 ) { // 用户不存在
        return rej('用户名不存在')
      }
      // 用户存在
      const userpwd = data[0].password
      // 加密后再判断
      if ( encrypt(password) === userpwd ) {
        res(data)
      } else {
        rej('密码错误~~')
      }

    })
  })
  .then(async (data) => {
    ctx.cookies.set('username', username, {
      domain: 'localhost',
      path: '/',
      maxAge: 36e5,
      httpOnly: false,
      overwrite: false,
    })
    ctx.cookies.set('uid', data[0]._id, {
      domain: "localhost",
      path: "/",
      maxAge: 36e5,
      httpOnly: false, // true 不让客户端能访问这个 cookie
      overwrite: false
    })
    ctx.session = {
      username,
      uid: data[0]._id,
      avatar: data[0].avatar,
      role: data[0].role
    }

    await ctx.render('isOk', {
      status: '登录成功~!'
    })
  })
  .catch(async (status) => {
    await ctx.render('isOk', {status})
  })
}

exports.keeplog = async (ctx, next) => {
  /* 双重判断 
  * 如果session没有登录状态，判断客户端有没有cookie信息,
  * 有则重新设置session, 没有则表示用户未登录  
  */
  if (ctx.session.isNew) { // isNew为true,则没有状态(为登录), undefined(登录状态)
    if (ctx.cookies.get('username')) {
      let uid = ctx.cookies.get('uid')
      const avatar = await User.findById(uid).then(data => data.avatar)
      

      ctx.session = {
        username: ctx.cookies.get('username'),
        uid,
        avatar
      }
    }
  }
  await next()
}

exports.logout = async ctx => {
  ctx.cookies.set('username', null, {
    maxAge: 0
  })
  ctx.cookies.set('uid', null, {
    maxAge: 0
  })
  ctx.session = null
  // 重定向
  ctx.redirect('/')
}

// 用户头像上传
exports.upload = async ctx => {
  const filename = ctx.req.file.filename

  let data = {}
  await User.updateOne({_id: ctx.session.uid}, 
    {$set: {avatar: `/avatar/${filename}`}})
    .then(result => {
      data.state = 1,
      data.msg = '上传成功'
    }).catch(err => {
      data.state = 0,
      data.msg = '上传失败'
    })

    ctx.body = data
}