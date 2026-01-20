// post all route
import express from "express";
import { postsController } from "./post.controller";
import { auth, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.user,UserRole.admain), postsController.createPost);
router.get("/",postsController.getallPost)
router.get('/authorPost',auth(UserRole.admain,UserRole.user),postsController.getAllPostBysingelUser)
router.get('/postState',postsController.postState)
router.get(`/:postId`,postsController.getSinglePost)
router.patch('/:postId',auth(UserRole.user,UserRole.admain),postsController.updateUserPostByUserId);
router.delete('/:postId',auth(UserRole.user,UserRole.admain),postsController.deletePostByUserId);

export const postrouter = router;
