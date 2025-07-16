const Comment = require('../models/Comment');

exports.createComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({ ...req.body, post: req.params.postId, createdBy: req.user._id });
    res.status(201).json(comment);
  } catch (err) { next(err); }
};

exports.getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('createdBy', 'username');
    res.json(comments);
  } catch (err) { next(err); }
};

exports.updateComment = async (req, res, next) => {
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
};

exports.deleteComment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
};