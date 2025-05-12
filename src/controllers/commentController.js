const db = require('../config/db'); // Adjust path based on your project structure

// Add a new comment
exports.addComment = async (req, res) => {
    const { post_id, user_id, comment_text } = req.body;

    try {
        await db.query(
            'INSERT INTO comments (post_id, user_id, comment_text, created_at) VALUES (?, ?, ?, NOW())',
            [post_id, user_id, comment_text]
        );
        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

// Edit a comment by ID
exports.editComment = async (req, res) => {
    const { id } = req.params;
    const { comment_text } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE comments SET comment_text = ? WHERE id = ?',
            [comment_text, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM comments WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};

// Get all comments for a post with user info
exports.getCommentsByPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT c.id AS comment_id, c.comment_text, c.created_at,
                    u.id AS user_id, u.username, u.profile_image
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = ?
             ORDER BY c.created_at DESC`,
            [post_id]
        );

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};
