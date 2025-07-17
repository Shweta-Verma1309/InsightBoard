const express = require("express");
const router = express.Router();

const commentController= require("../controllers/commentController");



const auth = require("../../common/middleware/authMiddleware");

router.post("/", auth, commentController.createComment);
router.get("/post/:postId", auth, commentController.getCommentsByPost);
router.put("/:id", auth, commentController.updateComment);
router.delete("/:id", auth, commentController.deleteComment);

module.exports = router;