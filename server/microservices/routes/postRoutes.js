const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const auth = require("../../common/middleware/authMiddleware");

router.post("/:boardId/posts", auth, postController.createPost);
router.get("/:id", auth, postController.getPostsByBoard);
router.put("/:id", auth, postController.updatePost);
router.delete("/:id", auth, postController.deletePost);
router.post("/:id/vote", auth, postController.votePost);

module.exports = router;