import express from 'express'
import { commentController } from './comment.controller';
import { auth, UserRole } from '../../middlewares/auth';

const router= express.Router();
router.get(`/:commentId`,commentController.getCommentById)
router.get('/author/:authorId',commentController.getcommentByAuthorId)
router.post('/',auth(UserRole.user,UserRole.admain),commentController.createComment)
router.delete('/:commentId',auth(UserRole.admain,UserRole.user),commentController.deleteCommentByID)
router.patch('/:commentId',auth(UserRole.admain,UserRole.user),commentController.updatedComment)
router.patch('/:commentId/status',auth(UserRole.admain),commentController.updateComentStatus)
export const commentRouter=router;