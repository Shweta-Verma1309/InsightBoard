const Comment = require('../common/models/Comment');

class CommentController {
  async createComment(req, res, next) {
    try {
      const comment = await Comment.create({
        ...req.body,
        post: req.params.postId,
        createdBy: req.user._id,
      });
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  async getCommentsByPost(req, res, next) {
    try {
      const comments = await Comment.find({ post: req.params.postId }).populate('createdBy', 'username');
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }

  async updateComment(req, res, next) {
    try {
      const updated = await Comment.findByIdAndUpdate(
        req.params.id,
        { content: req.body.content },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Comment not found' });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

// Export an instance to use directly
module.exports = new CommentController();
