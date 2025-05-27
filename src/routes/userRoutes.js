import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers
    // getUserComments,
    // getUserLikes,
    // getPostDetails,
    // getUserActivity,
    // getUserProfileWithStats
} from '../controllers/userController.js';

import { authChecker } from '../middleware/authMiddleware.js';
const router = express.Router();
import RoleConstants from '../Constants/Role.js';
import{validateRegister,validateLogin,validateUpdateProfile} from '../validators/userValidator.js'

const { ROLES, ROLESGROUP } = RoleConstants;

// 1. User registration route (For all)
router.post('/register',validateRegister, registerUser);

// 2. User login route (For all)
router.post('/login', validateLogin,loginUser);

// 3. Get user profile route (Admin and user own --intially)
router.get('/profile',authChecker(ROLESGROUP.AdminUserRole),getUserProfile);


// 4. Update user profile route (user and admin)
router.put('/update',authChecker(ROLESGROUP.AdminUserRole),validateUpdateProfile,updateUserProfile);

// 5. Delete user profile route (admin and user own previliges)
router.delete('/delete',authChecker(ROLESGROUP.AdminUserRole), deleteUserProfile);

// 6. Get all the user data (admin only)
router.get('/allusers',authChecker(ROLESGROUP.AdminRole), getAllUsers);

// 6.Get User post details
// router.get('/:id/posts', getPostDetails);

//7. Get post with user, comments, and likes info
// router.get('/:id/details', getUserProfileWithStats);

// 8.Get all posts liked by a user
// router.get('/:id/likes', getUserLikes);

// 9. Get full activity of a user (posts, comments, likes)
// router.get('/:id/activity', getUserActivity);

export default router;