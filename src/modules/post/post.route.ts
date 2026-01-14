// post all route
import express from "express";
import { postsController } from "./post.controller";
import { auth, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.user), postsController.createPost);
router.get("/",postsController.getallPost)
router.get(`/:postId`,postsController.getSinglePost)
export const postrouter = router;
