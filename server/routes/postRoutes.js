const express = require("express");
const router = express.Router();

const {
  createPost,
  getPostsByBoard,
  updatePost,
  deletePost,
  votePost,
} = require("../controllers/postController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, createPost);
router.get("/board/:boardId", auth, getPostsByBoard);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/vote", auth, votePost);

module.exports = router;