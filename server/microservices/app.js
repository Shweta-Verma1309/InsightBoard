const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('../common/middleware/errorMiddleware');

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ✅ Handle preflight explicitly (fix for some versions)
app.options("*", cors());

app.use(cookieParser());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error("🔥 Internal Error:", err.stack); // Log full stack trace
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);
module.exports = app;