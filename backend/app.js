import MongoStore from 'connect-mongo'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import logger from 'morgan'
import path from 'path'
import connectDb from './config/db.connection.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8000

import adminRouter from './routes/adminRouter.js'
import userRouter from './routes/userRouter.js'

//connect to database
connectDb()

//middlewares
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(cookieparser())
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 72 },
        store: MongoStore.create({ mongoUrl: process.env.DB_URI }),
    })
)
app.use(express.json())
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(cors({ origin: ['http://localhost:4200'], credentials: true }))

//listening
app.listen(PORT, () => {
    console.log(`server started at  http://localhost:${PORT}`)
})

//route setup
app.use('/api', userRouter)
app.use('/api/admin', adminRouter)
