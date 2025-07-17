const Post = require('../common/models/Post');
const Comment = require('../common/models/Comment');

class AnalyticsController {
  async getTopVotedPosts(req, res, next) {
    try {
      const posts = await Post.aggregate([
        {
          $project: {
            content: 1,
            votes: {
              $subtract: [
                { $size: '$upvotes' },
                { $size: '$downvotes' }
              ]
            }
          }
        },
        { $sort: { votes: -1 } },
        { $limit: 10 }
      ]);
      res.json(posts);
    } catch (err) {
      next(err);
    }
  }

  async getMostActiveUsers(req, res, next) {
    try {
      const users = await Comment.aggregate([
        { $group: { _id: '$createdBy', comments: { $sum: 1 } } },
        { $sort: { comments: -1 } },
        { $limit: 10 }
      ]);
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getTrendingTags(req, res, next) {
    try {
      const tags = await Post.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      res.json(tags);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();
