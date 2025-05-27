import db from '../models/index.js';

const { Like, User } = db;

// Like a post
export const likePost = async (req, res) => {
  const { user_id, post_id } = req.body;

  try {
    // Check if the user already liked this post
    const existingLike = await Like.findOne({ where: { user_id, post_id } });

    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    // Add a new like
    await Like.create({ user_id, post_id });

    res.status(201).json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking the post', error });
  }
};

// Dislike (remove like) from a post
export const dislikePost = async (req, res) => {
  const { user_id, post_id } = req.body;

  try {
    // Check if the like exists
    const existingLike = await Like.findOne({ where: { user_id, post_id } });

    if (!existingLike) {
      return res.status(400).json({ message: 'You have not liked this post yet' });
    }

    // Remove the like
    await Like.destroy({ where: { user_id, post_id } });

    res.status(200).json({ message: 'Post disliked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error disliking the post', error });
  }
};

// Get total likes for a post
export const getTotalLikes = async (req, res) => {
  const { post_id } = req.params;

  try {
    const totalLikes = await Like.count({ where: { post_id } });

    res.status(200).json({ totalLikes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the total likes', error });
  }
};

// Get all users who liked a post
export const getUsersWhoLiked = async (req, res) => {
  const { post_id } = req.params;

  try {
    const users = await User.findAll({
      include: {
        model: Like,
        where: { post_id },
        attributes: []
      },
      attributes: ['id', 'username', 'email']
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users have liked this post' });
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users who liked the post', error });
  }
};
