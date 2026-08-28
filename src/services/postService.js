const { AppError } = require("../errors/AppError");
const { postRepository } = require("../repositories/postRepository");

function normalize(body = {}) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const author =
    typeof body.author === "string" && body.author.trim()
      ? body.author.trim()
      : "익명";

  return { title, content, author };
}

function validatePostInput({ title, content }) {
  if (!title || !content) {
    throw new AppError("제목과 내용을 입력해 주세요.", 400);
  }
}

const postService = {
  async getAll() {
    return postRepository.findAll();
  },

  async getById(id) {
    const post = await postRepository.findById(id);

    if (!post) {
      throw new AppError("게시글을 찾을 수 없습니다.", 404);
    }

    return post;
  },

  async create(body) {
    const payload = normalize(body);
    validatePostInput(payload);
    return postRepository.create(payload);
  },

  async update(id, body) {
    const existing = await postRepository.findById(id);

    if (!existing) {
      throw new AppError("게시글을 찾을 수 없습니다.", 404);
    }

    const payload = normalize(body);
    validatePostInput(payload);
    return postRepository.update(id, payload);
  },

  async remove(id) {
    const existing = await postRepository.findById(id);

    if (!existing) {
      throw new AppError("게시글을 찾을 수 없습니다.", 404);
    }

    await postRepository.delete(id);
  },
};

module.exports = { postService };
