import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';


// Compare password helper
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
// Helper function to generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};
