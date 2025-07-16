const express = require("express");
const router = express.Router();

const {
  getTopVotedPosts,
  getTrendingTags,
  getMostActiveUsers,
} = require("../controllers/analyticsController");

const auth = require("../middleware/authMiddleware");

router.get("/top-voted", auth, getTopVotedPosts);
router.get("/trending-tags", auth, getTrendingTags);
router.get("/active-users", auth, getMostActiveUsers);

module.exports = router;
