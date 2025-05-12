const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController'); // Adjust path based on your project structure

// Like a post
router.post('/like', likeController.likePost);

// Dislike a post
router.post('/dislike', likeController.dislikePost);

// Get total likes for a post
router.get('/:post_id/likes', likeController.getTotalLikes);

// Get users who liked a post
router.get('/:post_id/users', likeController.getUsersWhoLiked);

module.exports = router;
