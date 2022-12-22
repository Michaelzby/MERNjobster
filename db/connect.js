import mongoose from 'mongoose'

const connectDB = (url) => {
  return mongoose.connect(url)
}
// url里面加上数据库名称 直接全存到kissmebitch里面了 就可以用好机会了 全进数据库了user job
export default connectDB
