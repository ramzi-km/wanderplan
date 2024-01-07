// import MongoStore from 'connect-mongo'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config.js'
import express from 'express'
// import session from 'express-session'
import http from 'http'
import logger from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import connectDb from './config/db.connection.js'
import socketConnect from './config/socketConnect.js'

const app = express()
const PORT = process.env.PORT || 8000

//socket.io
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [
            process.env.CLIENT_URL_1,
            process.env.CLIENT_URL_2,
            process.env.CLIENT_URL_3,
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    },
})

import adminRouter from './routes/adminRouter.js'
import userRouter from './routes/userRouter.js'

//connect to database
connectDb()

//middlewares
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(cookieparser())
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET_KEY,
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             sameSite: 'none',
//             secure: true,
//         },
//     })
// )
app.use(express.json({ limit: '50mb' }))
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(
    cors({
        origin: [
            process.env.CLIENT_URL_1,
            process.env.CLIENT_URL_2,
            process.env.CLIENT_URL_3,
        ],
        credentials: true,
    })
)

//listening
server.listen(PORT, () => {
    console.log(`server started at  http://localhost:${PORT}`)
})
socketConnect(io)

//route setup
app.use('/api', userRouter)
app.use('/api/admin', adminRouter)
