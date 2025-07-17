const Post = require('../../common/models/Post');

class PostController {
  async createPost(req, res, next) {
    try {
      const post = await Post.create({
        ...req.body,
        board: req.params.boardId,
        createdBy: req.user._id,
      });
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }

  async getPostsByBoard(req, res, next) {
    try {
      const query = { board: req.params.boardId };

      if (req.query.tag) query.tags = req.query.tag;
      if (req.query.status) query.status = req.query.status;

      let postsQuery = Post.find(query).populate('createdBy', 'username');
      if (req.query.sort === 'popular') postsQuery = postsQuery.sort({ upvotes: -1 });

      const posts = await postsQuery;
      res.json(posts);
    } catch (err) {
      next(err);
    }
  }

  async getPost(req, res, next) {
    try {
      const post = await Post.findById(req.params.id).populate('createdBy', 'username');
      if (!post) return res.status(404).json({ message: 'Not found' });
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  async votePost(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);
      const userId = req.user._id;
      const { type } = req.body;

      if (type === 'up') {
        post.downvotes.pull(userId);
        post.upvotes.includes(userId)
          ? post.upvotes.pull(userId)
          : post.upvotes.push(userId);
      } else {
        post.upvotes.pull(userId);
        post.downvotes.includes(userId)
          ? post.downvotes.pull(userId)
          : post.downvotes.push(userId);
      }

      await post.save();
      res.json({
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
      });
    } catch (err) {
      next(err);
    }
  }
}

// Export an instance
module.exports = new PostController();
