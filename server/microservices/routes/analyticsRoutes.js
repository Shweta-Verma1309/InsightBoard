const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analyticsController");
const auth = require("../../common/middleware/authMiddleware");

router.get("/top-voted", auth, analyticsController.getTopVotedPosts);
router.get("/trending-tags", auth, analyticsController.getTrendingTags);
router.get("/active-users", auth, analyticsController.getMostActiveUsers);

module.exports = router;
