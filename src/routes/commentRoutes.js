import express from 'express';
import {
  addComment,
  editComment,
  deleteComment,
  getCommentsByPost
} from '../controllers/commentController.js';
import {authChecker} from '../middleware/authMiddleware.js'
import RoleConstants from '../Constants/Role.js';
const { ROLES, ROLESGROUP } = RoleConstants;


const router = express.Router();
//1. Adding the comment to the post 
router.post('/comments',authChecker(ROLES.USER), addComment);
//2.Edit in the comment if exist . --need changes in future
router.put('/comments/:id',authChecker(ROLES.USER), editComment);
//Delete the comment by the comment id 
router.delete('/comments/:id',authChecker(ROLESGROUP.AdminUserRole), deleteComment);
//Get all the comments that are on the post 
router.get('/posts/:post_id/comments', authChecker(ROLESGROUP.AdminUserRole),getCommentsByPost);

export default router;
    