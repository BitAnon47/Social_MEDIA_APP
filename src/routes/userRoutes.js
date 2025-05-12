const express = require('express');
const router = express.Router();
// Import user controller functions (to be implemented)
const { 
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    logoutUser,
    getUserComments, 
    getUserLikes, 
    getPostDetails, 
    getUserActivity, 
    getUserProfileWithStats
} = require('../controllers/userController');

//1.User registration route
router.post('/register', registerUser);

//2. User login route
router.post('/login', loginUser);

//3. Get user profile route
router.get('/profile/:id', getUserProfile);

// 4. Update user profile route
router.put('/update/:id', updateUserProfile);

// 5. Delete user profile route
router.delete('/delete/:id', deleteUserProfile);

// 6. Logout user route
router.post('/logout', logoutUser);

// 7.Get User post details 
router.get('/:id/posts', getPostDetails);

//8.Get post with user, comments, and likes info
router.get('/:id/details', getUserProfileWithStats);

//9. Get all posts liked by a user
router.get('/:id/likes', getUserLikes);

//10.Get full activity of a user (posts, comments, likes)
router.get('/:id/activity', getUserActivity);


module.exports = router;