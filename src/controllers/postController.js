const { postService } = require("../services/postService");

const postController = {
  async list(_req, res, next) {
    try {
      const posts = await postService.getAll();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const post = await postService.getById(req.params.id);
      res.json(post);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const post = await postService.create(req.body);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const post = await postService.update(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await postService.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { postController };
