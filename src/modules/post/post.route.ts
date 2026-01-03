// post all route

import express from 'express'
import { postsController } from './post.controller';

const router= express.Router();

router.post('/',postsController.createPost)
export const postrouter=router