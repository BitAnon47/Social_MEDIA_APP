import express from 'express';
import {
  likePost,
  dislikePost,
  getTotalLikes,
  getUsersWhoLiked
} from '../controllers/likeController.js';
import {authChecker} from '../middleware/authMiddleware.js'
import RoleConstants from '../Constants/Role.js';
const { ROLES, ROLESGROUP } = RoleConstants;

const router = express.Router();

// Like a post
router.post('/like',authChecker(ROLES.USER), likePost);

// Dislike a post
router.post('/dislike',authChecker(ROLES.USER), dislikePost);

// Get total likes for a post
router.get('/:post_id/likes',authChecker(ROLESGROUP.CommonRole), getTotalLikes);

// Get users who liked a post
router.get('/:post_id/users',authChecker(ROLESGROUP.AdminUserRole), getUsersWhoLiked);

export default router;
