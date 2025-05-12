const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/');

// 1. Register a new user
exports.registerUser = async (req, res) => {
    const { username, email, password, profile_image } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, profile_image, created_at) VALUES (?, ?, ?, ?, NOW())',
            [username, email, hashedPassword, profile_image]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};
// 2. Login a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
//3. Get user profile
exports.getUserProfile = async (req, res) => {
    const { id } = req.params; // Assuming the user ID is passed as a query parameter

    try {
        // Fetch user profile from the database
        const [rows] = await db.query('SELECT id, username, email, profile_image, created_at FROM users WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
};
//4.Update user profile
exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        if (!id || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'User ID and at least one field are required.' });
        }

        const fields = [];
        const values = [];

        for (const key in updates) {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        }

        values.push(id); // Add ID for WHERE clause

        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made.' });
        }

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error });
    }
};

//5. Delete user profile
exports.deleteUserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete user from the database
        await db.query('DELETE FROM users WHERE id = ?', [id]);

        res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user profile', error });
    }
};
//6.Logout user
exports.logoutUser = (req, res) => {
    // Invalidate the token (handled on the client side by removing it)
    res.status(200).json({ message: 'User logged out successfully' });
};
//7.User POST details
exports.getPostDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
        if (post.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const [comments] = await db.query('SELECT * FROM comments WHERE post_id = ?', [id]);
        const [likes] = await db.query('SELECT * FROM likes WHERE post_id = ?', [id]);

        res.status(200).json({ post: post[0], comments, likes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post details', error });
    }
};
//8.User profile with stats of the user activity
exports.getUserProfileWithStats = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch user profile with total posts, comments, and likes
        const [user] = await db.query('SELECT id, username, email, profile_image, created_at FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [stats] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM posts WHERE user_id = ?) AS total_posts,
                (SELECT COUNT(*) FROM comments WHERE user_id = ?) AS total_comments,
                (SELECT COUNT(*) FROM likes WHERE user_id = ?) AS total_likes
        `, [id, id, id]);

        res.status(200).json({ user: user[0], stats: stats[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile with stats', error });
    }
};
//9. UserLikes on the number of posts 
exports.getUserLikes = async (req, res) => {
    const { id } = req.params;

    try {
        const [likes] = await db.query(`
            SELECT posts.* 
            FROM likes 
            JOIN posts ON likes.post_id = posts.id 
            WHERE likes.user_id = ?
        `, [id]);
        res.status(200).json({ likedPosts: likes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching liked posts', error });
    }
};
//10 .Get all data of the user its every single acitivity like posts,comments,likes.
exports.getUserActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const [posts] = await db.query('SELECT * FROM posts WHERE user_id = ?', [id]);
        const [comments] = await db.query('SELECT * FROM comments WHERE user_id = ?', [id]);
        const [likes] = await db.query(`
            SELECT posts.* 
            FROM likes 
            JOIN posts ON likes.post_id = posts.id 
            WHERE likes.user_id = ?
        `, [id]);

        res.status(200).json({ posts, comments, likedPosts: likes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user activity', error });
    }
};