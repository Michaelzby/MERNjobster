import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

// 检查登陆身份
// user这个集从数据库里面来


// 总体的逻辑是 appcontext前端setupuser  发送一个axios http请求到server express收到 express进行包装 执行register（在数据库里面）
const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    // 有问题就throw error 会交给error handler解决  express async errors的作用   减少重复try catch
    // badrequest是我们自己创建出来的error类
    throw new BadRequestError('please provide all values')
  }
  const userAlreadyExists = await User.findOne({ email })
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use')
  }
  const user = await User.create({ name, email, password })
  // 利用userschema创建一个user 应该就是在数据库里面创建了

  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  })
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide all values')
  }
  const user = await User.findOne({ email }).select('+password')
  // 这里为什么要select？比如我们登录的时候 user findone  我们不希望password出来因为我们还要比对password
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials')
  }
// 这里用到了身份不符合
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials')
  }
  const token = user.createJWT()
  // 这里不希望password被看到
  user.password = undefined
  res.status(StatusCodes.OK).json({ user, token, location: user.location })
}
const updateUser = async (req, res) => {
  // 这个updateuser是识别传过来的http请求的
  const { email, name, lastName, location } = req.body
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values')
  }
  const user = await User.findOne({ _id: req.user.userId })
  // 这里不返回password因为selected false
  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location

  await user.save()

  const token = user.createJWT()

  res.status(StatusCodes.OK).json({ user, token, location: user.location })
}

export { register, login, updateUser }
