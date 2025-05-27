import jwt, { decode } from "jsonwebtoken";
import db from "../models/index.js";
const { User, Role } = db;
import dotenv from 'dotenv';
import { Model } from "sequelize";
dotenv.config();


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
 if (!token) {
    return next(); // No token — allow public access
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("decode", decoded);
    const user = await User.findByPk(decoded.id,
      {
        include:
          {
            model: Role,
            as: 'role',
            required: true,
             attributes: ['roleName']
          },
      }
    );

    // console.log(user);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid token: user not found" });
    }
     
    // console.log(user);

    req.user = {
      id: user.id,
      roleName: user.role.roleName,
      };

      // console.log(req.user);
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authenticateToken;