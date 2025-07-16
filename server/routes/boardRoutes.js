const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");

const auth = require("../middleware/authMiddleware");

// Routes
router.post("/", auth, createBoard);
router.get("/", auth, getBoards);
router.get("/:id", auth, getBoardById);
router.put("/:id", auth, updateBoard);
router.delete("/:id", auth, deleteBoard);

module.exports = router;
