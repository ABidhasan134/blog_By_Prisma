import express from 'express'
import { commentController } from './comment.controller';
import { auth, UserRole } from '../../middlewares/auth';

const router= express.Router();

router.post('/',auth(UserRole.user,UserRole.admain),commentController.createComment)

export const commentRouter=router;