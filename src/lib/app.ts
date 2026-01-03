import express from 'express'
import { postrouter } from '../modules/post/post.route';

 const app=express();

 app.use(express.json());
 app.use('/post',postrouter)
 app.get('/',(req,res)=>{
    console.log("Hello world")
    res.send("hello world")
 })
 export default app;