// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import db from '../models/index.js';  // Adjusted for ESM import
const { User,Role } = db;

import { generateToken } from '../Utils/Helper.js';
import bcrypt from 'bcryptjs';
 
// 1. Register a new user --Done  
export const registerUser = async (req, res) => {
  console.log('Request body:', req.body); // Add this line
  const { username, email, password, profile_image_url } = req.body;

  try {
    // Password is stored as plain text for now (not recommended for production)
    const user = await User.create({
      username,
      email,
      password,
      profile_image_url
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }
    console.error('Register Error:', error); 
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// 2. Login a user --Done
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// 3. Get user profile --Done
export const getUserProfile = async (req, res) => {
  const  id  = req.user.id;
  console.log(req.user);
  try {
   const user = await User.findByPk(id, {
  attributes: ['id', 'username', 'email', 'profile_image_url', 'role_id'],
  include: {
    model: Role,
    as:'role',
    attributes: ['roleName']
  }
});


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// 4. Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    
    const isAdmin = req.user.roleName?.toLowerCase() === "admin";
    const targetUserId = isAdmin && req.body.id ? /*parseInt(req.body.id, 10)*/ req.body.id : req.user.id;

    // console.log("🔍 Debug targetUserId that we want to update:", targetUserId);

    // 🔍 Find Target User in Database
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 📩 Extract update fields
    const { username, email, password, profile_image_url } = req.body;

    // 🛠 Prepare update object
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = password; // Assumed to be hashed via model
    if (profile_image_url) updates.profile_image_url = profile_image_url;

    // 🚀 Execute update operation
    await targetUser.update(updates);

    res.status(200).json({ message: "Profile updated successfully", updatedUser: targetUser });

  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};


// 5. Delete user profile
export const deleteUserProfile = async (req, res) => {
  const id  = req.user.id;

  try {
    const result = await User.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user profile', error });
  }
};

 // 6.Get all the user details (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'profile_image_url', 'created_at'],
      include: {
        model: Role,
        as: 'role',
        attributes: ['roleName'],  // Only fetch role name
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};






// //6.User POST details
// exports.getPostDetails = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
//         if (post.length === 0) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         const [comments] = await db.query('SELECT * FROM comments WHERE post_id = ?', [id]);
//         const [likes] = await db.query('SELECT * FROM likes WHERE post_id = ?', [id]);

//         res.status(200).json({ post: post[0], comments, likes });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching post details', error });
//     }
// };
// //7.User profile with stats of the user activity
// exports.getUserProfileWithStats = async (req, res) => {
//     const { id } = req.params;

//     try {
//         // Fetch user profile with total posts, comments, and likes
//         const [user] = await db.query('SELECT id, username, email, profile_image, created_at FROM users WHERE id = ?', [id]);
//         if (user.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const [stats] = await db.query(`
//             SELECT 
//                 (SELECT COUNT(*) FROM posts WHERE user_id = ?) AS total_posts,
//                 (SELECT COUNT(*) FROM comments WHERE user_id = ?) AS total_comments,
//                 (SELECT COUNT(*) FROM likes WHERE user_id = ?) AS total_likes
//         `, [id, id, id]);

//         res.status(200).json({ user: user[0], stats: stats[0] });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching user profile with stats', error });
//     }
// };
// //8. UserLikes on the number of posts 
// exports.getUserLikes = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const [likes] = await db.query(`
//             SELECT posts.* 
//             FROM likes 
//             JOIN posts ON likes.post_id = posts.id 
//             WHERE likes.user_id = ?
//         `, [id]);
//         res.status(200).json({ likedPosts: likes });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching liked posts', error });
//     }
// };
// //9 .Get all data of the user its every single acitivity like posts,comments,likes.
// exports.getUserActivity = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const [posts] = await db.query('SELECT * FROM posts WHERE user_id = ?', [id]);
//         const [comments] = await db.query('SELECT * FROM comments WHERE user_id = ?', [id]);
//         const [likes] = await db.query(`
//             SELECT posts.* 
//             FROM likes 
//             JOIN posts ON likes.post_id = posts.id 
//             WHERE likes.user_id = ?
//         `, [id]);

//         res.status(200).json({ posts, comments, likedPosts: likes });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching user activity', error });
//     }
// };