const db = require('../config/db'); 
// Like a post
exports.likePost = async (req, res) => {
    const { user_id, post_id } = req.body;

    try {
        // Check if the user has already liked this post
        const [existingLike] = await db.query(
            'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
            [user_id, post_id]
        );

        if (existingLike.length > 0) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Add a new like
        await db.query(
            'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
            [user_id, post_id]
        );

        res.status(201).json({ message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error liking the post', error });
    }
};

// Dislike a post
exports.dislikePost = async (req, res) => {
    const { user_id, post_id } = req.body;

    try {
        // Check if the user has liked this post
        const [existingLike] = await db.query(
            'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
            [user_id, post_id]
        );

        if (existingLike.length === 0) {
            return res.status(400).json({ message: 'You have not liked this post yet' });
        }

        // Remove the like (dislike)
        await db.query(
            'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
            [user_id, post_id]
        );

        res.status(200).json({ message: 'Post disliked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error disliking the post', error });
    }
};

// Get total likes for a post

exports.getTotalLikes = async (req, res) => {
    const { post_id } = req.params;

    try {
        // Get the total number of likes for the given post
        const [likes] = await db.query(
            'SELECT COUNT(*) AS totalLikes FROM likes WHERE post_id = ?',
            [post_id]
        );

        res.status(200).json({ totalLikes: likes[0].totalLikes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching the total likes', error });
    }
};

// Get all users who liked a post
exports.getUsersWhoLiked = async (req, res) => {
    const { post_id } = req.params;

    try {
        // Fetch all users who liked the given post
        const [users] = await db.query(
            'SELECT u.id, u.username, u.email FROM likes l JOIN users u ON l.user_id = u.id WHERE l.post_id = ?',
            [post_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users have liked this post' });
        }

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users who liked the post', error });
    }
};
