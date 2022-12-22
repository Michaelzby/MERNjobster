import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

// hello
// db and authenticateUser
import connectDB from './db/connect.js'

// routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

const __dirname = dirname(fileURLToPath(import.meta.url))

// only when ready to deploy
// 部署的时候使用
app.use(express.static(path.resolve(__dirname, './client/build')))

app.use(express.json())
app.use(helmet())
// - remove log in the error-handler
// - [helmet](https://www.npmjs.com/package/helmet)
//   Helmet helps you secure your Express apps by setting various HTTP headers.
// - [xss-clean](https://www.npmjs.com/package/xss-clean)
//   Node.js Connect middleware to sanitize user input coming from POST body, GET queries, and url params.
// - [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
//   Sanitizes user-supplied data to prevent MongoDB Operator Injection.
// - [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
//   Basic rate-limiting middleware for Express.
app.use(xss())
app.use(mongoSanitize())


// 这个两个身份的基础路径 这样就和之前set up user里面发送的axios请求对应上了
app.use('/api/v1/auth', authRouter)
// job 之前 先确认身份
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

// only when ready to deploy
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
// here the port is 4000 because we have it in env

// 比如我们port 3000 从5000 fetchdata 就会出现这个问题
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
