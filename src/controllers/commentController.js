import db from '../models/index.js';

const { Comment, User } = db;

// Now use Comment and User as usual

// Add a new comment
export const addComment = async (req, res) => {
  const { post_id, user_id, comment_text } = req.body;

  try {
    await Comment.create({
      post_id,
      user_id,
      comment_text,
      created_at: new Date()
    });

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Edit a comment by ID
export const editComment = async (req, res) => {
  const { id } = req.params;
  const { comment_text } = req.body;

  try {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.update({ comment_text });

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error });
  }
};

// Delete a comment by ID
export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Comment.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};

// Get all comments for a post with user info
export const getCommentsByPost = async (req, res) => {
  const { post_id } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { post_id },
      include: {
        model: User,
        attributes: ['id', 'username', 'profile_image']
      },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};
