const express = require('express');
const router = express.Router();
const userPostsController = require('../controllers/postController');

// Create a new post
router.post('/', userPostsController.createPost);

// Get all posts with user, likes, and comments info
router.get('/all', userPostsController.getAllPosts);

// Get a post by ID with joins
router.get('/:id', userPostsController.getPostById);

// Delete a post by ID
router.delete('/delete/:id', userPostsController.deletePost);

module.exports = router;
