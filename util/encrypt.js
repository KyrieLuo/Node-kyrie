const crypto = require('crypto')


module.exports = function (password, key = "i'm handsome") {
  const hmac = crypto.createHmac('sha256', key)
  hmac.update(password)
  const pwdHmac = hmac.digest('hex')
  return pwdHmac
}