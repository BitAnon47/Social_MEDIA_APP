import { body } from "express-validator";

export const validateRegister = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateUpdateProfile = [
  body("username").optional().notEmpty().withMessage("Username cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email required"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("profile_image_url").optional().isURL().withMessage("Profile image must be a valid URL"),
];
