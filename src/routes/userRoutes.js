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
    getUserActivity 
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
// 7.Get all comments made by a user
//router.get('/:id/comments', getUserComments);

//8. Get all posts liked by a user
router.get('/:id/likes', getUserLikes);

//9.Get post with user, comments, and likes info
router.get('/:id/details', getPostDetails);

//10.Get full activity of a user (posts, comments, likes)
router.get('/:id/activity', getUserActivity);


module.exports = router;