// post all route
import express from "express";
import { postsController } from "./post.controller";
import { auth, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.user,UserRole.admain), postsController.createPost);
router.get("/",postsController.getallPost)
router.get('/authorPost',auth(UserRole.admain,UserRole.user),postsController.getAllPostBysingelUser)
router.get(`/:postId`,postsController.getSinglePost)
export const postrouter = router;
