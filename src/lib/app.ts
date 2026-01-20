import express from 'express'
import { postrouter } from '../modules/post/post.route';
import { commentRouter } from '../modules/comment/comment.route';
import { toNodeHandler } from "better-auth/node";
import { auth } from './auth';
import cors from 'cors'
import errorHandler from '../middlewares/globalErrorHeandelr';
 const app=express();

 app.use(express.json());

 app.use(cors({
   origin: process.env.FRONTEND_PORT_OR_POSTMAN_ORIGIN || "http://localhost:4000",
   credentials:true
 }))
 app.use("/api/auth", toNodeHandler(auth));
 app.use('/post',postrouter)
 app.use('/comment',commentRouter)
 app.get('/',(req,res)=>{
    console.log("Hello world")
    res.send("hello world")
 })
 app.use(errorHandler)
 export default app;