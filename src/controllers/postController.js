const db = require('../config/db'); // Assuming you have db connection setup
const moment = require('moment');

// Create a new post
exports.createPost = async (req, res) => {
    const { user_id, content, image_url } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO posts (user_id, content, image_url, created_at) VALUES (?, ?, ?, ?)',
            [user_id, content, image_url, moment().format('YYYY-MM-DD HH:mm:ss')]
        );

        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};

// Get all posts with user, likes, and comments count
exports.getAllPosts = async (req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT 
                p.id AS post_id,
                p.content,
                p.image_url,
                p.created_at,
                u.username,
                u.profile_image,
                COUNT(DISTINCT l.id) AS likes_count,
                COUNT(DISTINCT c.id) AS comments_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Get a single post by ID with joins
exports.getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                p.id AS post_id,
                p.content,
                p.image_url,
                p.created_at,
                u.username,
                u.profile_image,
                COUNT(DISTINCT l.id) AS likes_count,
                COUNT(DISTINCT c.id) AS comments_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};