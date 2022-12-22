import jwt from 'jsonwebtoken'
import { UnAuthenticatedError } from '../errors/index.js'

UnAuthenticatedError
const auth = async (req, res, next) => {
  // token用来检测header是不是用户自己
  // 这里可以直接从cookie里面取token
  // 之后 就不需要存token了 因为直接存到cookie里面
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    // 有没有自己请求的bearer
    throw new UnAuthenticatedError('Authentication Invalid')
  }
  const token = authHeader.split(' ')[1]
  // 检查token 对不对 检查完 确认user 如果user没问题就继续
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // 验证是不是这个jwt sign的
    req.user = { userId: payload.userId }

    next()
    // next就是执行之后的
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid')
  }
}

export default auth
