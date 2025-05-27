import express from 'express';
import {
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
  deletePost
} from '../controllers/postController.js';
import {authChecker} from '../middleware/authMiddleware.js'
import RoleConstants from '../Constants/Role.js';
const { ROLES, ROLESGROUP } = RoleConstants;
const router = express.Router();

// Create a new post
router.post('/new', authChecker(ROLES.USER), createPost);

// Get all posts with user, likes, and comments info
router.get('/all', authChecker(ROLESGROUP.CommonRole), getAllPosts);

//Update Api
router.put('/updatePost', authChecker(ROLESGROUP.AdminUserRole), updatePost)
// Get a post by ID with joins
router.get('/:id', authChecker(ROLES.USER), getPostById);

// Delete a post by ID
router.delete('/:id', authChecker(ROLESGROUP.AdminUserRole), deletePost);

export default router;
