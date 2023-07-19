import cookieparser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import connectDb from './config/db.connection.js';

const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();

import adminRoute from './routes/adminRoute.js';
import userRoute from './routes/userRoute.js';

//connect to database
connectDb()

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieparser());
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(cors({ origin: ['http://localhost:4200'], credentials: true}));

//listening
app.listen(PORT,()=>{
    console.log(`server started at  http://localhost:${PORT}`);
})

//route setup
app.use('/api',userRoute);
app.use('/api/admin', adminRoute);
