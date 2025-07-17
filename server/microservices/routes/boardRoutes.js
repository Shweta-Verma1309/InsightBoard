const express = require("express");
const router = express.Router();

const boardController = require("../microservices/controllers/boardController");

const auth = require("../common/middleware/authMiddleware");

// Routes
router.post("/", auth, boardController.createBoard);
router.get("/", auth, boardController.getBoards);
router.get("/:id", auth, boardController.getBoardById);
router.put("/:id", auth, boardController.updateBoard);
router.delete("/:id", auth, boardController.deleteBoard);

module.exports = router;
