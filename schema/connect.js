const mongoose = require('mongoose')

const db = mongoose.createConnection(
  'mongodb://localhost:27017/blogproject',
  {useNewUrlParser: true}
)
mongoose.Promise = global.Promise
// 将数据处理 Schema 分离
const Schema = mongoose.Schema

db.on('error', () => {
  console.log('database connect faild!!!')
})
db.on('open', () => {
  console.log('successly connect !!!')
})



module.exports = {
  db,
  Schema
}