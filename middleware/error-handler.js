import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
    // 这个处理是为了直接在controller里面就throw出来error了 那么我们对于这个error的处理肯定是优先输出这个message 不加这个或 直接又变成something了
    // controller是第一步 这个error name validation都是第二步 因为是从数据库返回的
  }
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    // defaultError.msg = err.message
    defaultError.msg = Object.values(err.errors)
    // 这里就是缺啥说啥 please provide email 逗号 please provide name         这里error的信息是create user user schema 返回的
    // 在这时候 还没有在create之前就检查全不全 还是在出现error处理的部分  authcontrol里面是create之前检查错误
    // 这里是出现错误 来 返回对应的报错信息
    // controller也是一种检查的方式
      .map((item) => item.message)
      .join(',')
  }
  if (err.code && err.code === 11000) {
    // unique的问题
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg })
}

export default errorHandlerMiddleware
