const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");



const auth = require("../middleware/authMiddleware");

router.post("/", auth, createComment);
router.get("/post/:postId", auth, getCommentsByPost);
router.put("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;