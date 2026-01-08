// post all route
import express from "express";
import { postsController } from "./post.controller";
import { auth, UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.user), postsController.createPost);
export const postrouter = router;
