import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from '../Backend/src/routes/userRoutes.js';
import postRoutes from '../Backend/src/routes/postRoutes.js';
import commentRoutes from '../Backend/src/routes/commentRoutes.js';
import likeRoutes from '../Backend/src/routes/likeRoutes.js';
import db from './src/models/index.js';
import dotenv from 'dotenv';
dotenv.config();
import authenticateToken from './src/middleware/authentication.js'


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// ✅ Global JWT Auth Middleware
app.use(authenticateToken);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Social Media API is running...');
});

db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
