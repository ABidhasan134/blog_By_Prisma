import express from 'express'
import { postrouter } from '../modules/post/post.route';
import { toNodeHandler } from "better-auth/node";
import { auth } from './auth';

 const app=express();

 app.use(express.json());
 app.all("/api/auth/*splat", toNodeHandler(auth));
// app.all("/api/auth/*", toNodeHandler(auth));
// app.all("/api/auth/:path(*)", toNodeHandler(auth));

 app.use('/post',postrouter)
 app.get('/',(req,res)=>{
    console.log("Hello world")
    res.send("hello world")
 })
 export default app;