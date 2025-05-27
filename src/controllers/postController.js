import db from '../models/index.js';

const { Post, User,Like,Comment } = db;

// Create a new post
export const createPost = async (req, res) => {
  const { user_id, content, image_url } = req.body;

  try {
    const post = await Post.create({
      user_id,
      content,
      image_url,
      // If your Post model uses defaultValue for createdAt, no need to pass it here
    });

    res.status(201).json({ message: 'Post created successfully', postId: post.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// Edit a post by ID
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.update(updates);
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

// Get all posts with user info, likes count, and comments count
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'content', 'created_at'], // include your own fields
      include: [
        {
          model: User,
          required: true,
          attributes: ['username', 'profile_image_url']
        },
        {
          model: Like,
          attributes: [],
          separate: true
        },
        {
          model: Comment,
          attributes: [],
          separate: true
        }
      ]
    });

    // Manually add likes_count and comments_count
    const result = await Promise.all(
      posts.map(async post => {
        const likesCount = await Like.count({ where: { post_id: post.id } });
        const commentsCount = await Comment.count({ where: { post_id: post.id } });

        return {
          ...post.toJSON(),
          likes_count: likesCount,
          comments_count: commentsCount
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error); // Add this
    res.status(500).json({ message: 'Error fetching posts', error: error.message || error.toString() });

  }
};

// Get a single post by ID with user info, likes count, and comments count
export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({
      where: { id },
      attributes: {
        include: [
          [
            Post.sequelize.literal(`(
              SELECT COUNT(*)
              FROM likes AS like
              WHERE
                like.post_id = Post.id
            )`),
            'likes_count'
          ],
          [
            Post.sequelize.literal(`(
              SELECT COUNT(*)
              FROM comments AS comment
              WHERE
                comment.post_id = Post.id
            )`),
            'comments_count'
          ]
        ],
        exclude: ['user_id']
      },
      include: [
        {
          model: User,
          attributes: ['username', 'profile_image_url']
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Post.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};
