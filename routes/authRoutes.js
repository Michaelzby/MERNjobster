import express from 'express'
const router = express.Router()

import rateLimiter from 'express-rate-limit'
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests from this IP, please try again after 15 minutes',
})

import { register, login, updateUser } from '../controllers/authController.js'
import authenticateUser from '../middleware/auth.js'
// 总体的逻辑是 appcontext前端setupuser  发送一个axios http请求到server express收到 express进行包装 执行register（在数据库里面）
router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
// 注意route的rate limit
// 这里是几个请求到我们的router
// react项目里面没有建立server
// axios 就是一个发送请求 返回数据的
// express是一个框架 做server 给发送请求加中间件 这里不是发送请求的 是一个处理请求的

// 谁都可以登录 注册 但是update需要检查身份
router.route('/updateUser').patch(authenticateUser, updateUser)

export default router
