require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRoutes = require('../Backend/src/routes/userRoutes');
const postRoutes = require('../Backend/src/routes/postRoutes');
const commentRoutes = require('../Backend/src/routes/commentRoutes');
const likeRoutes = require('../Backend/src/routes/likeRoutes');
const db = require('../Backend/src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

// Root
app.get('/', (req, res) => {
    res.send('Social Media API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
