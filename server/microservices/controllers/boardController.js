const Board = require('../common/models/Board');

class BoardController {
  async createBoard(req, res, next) {
    try {
      const board = await Board.create({
        ...req.body,
        createdBy: req.user._id,
        members: [req.user._id],
      });
      res.status(201).json(board);
    } catch (err) {
      next(err);
    }
  }

  async getBoards(req, res, next) {
    try {
      const boards = await Board.find({ members: req.user._id });
      res.json(boards);
    } catch (err) {
      next(err);
    }
  }

  async getBoardById(req, res, next) {
    try {
      const board = await Board.findById(req.params.id);
      if (!board) return res.status(404).json({ message: 'Not found' });
      res.json(board);
    } catch (err) {
      next(err);
    }
  }

  async updateBoard(req, res, next) {
    try {
      const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(board);
    } catch (err) {
      next(err);
    }
  }

  async deleteBoard(req, res, next) {
    try {
      await Board.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BoardController();
