const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController'); // Adjust path based on your project structure

// Add a new comment
router.post('/', commentController.addComment);

// Edit a comment by ID
router.put('/:id', commentController.editComment);

// Delete a comment by ID
router.delete('/:id', commentController.deleteComment);

// Get all comments for a post with user info
router.get('/post/:post_id', commentController.getCommentsByPost);

module.exports = router;
