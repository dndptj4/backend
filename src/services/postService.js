const { AppError } = require("../errors/AppError");
const { postRepository } = require("../repositories/postRepository");

function omitPassword(card) {
  if (!card) {
    return card;
  }

  const { password: _password, ...rest } = card;
  return rest;
}

function normalize(body = {}) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const author =
    typeof body.author === "string" && body.author.trim()
      ? body.author.trim()
      : "익명";
  const password =
    typeof body.password === "string" ? body.password.trim() : "";

  return { title, content, author, password };
}

function validatePassword(password) {
  if (!password) {
    throw new AppError("비밀번호를 입력해 주세요.", 400);
  }
}

function validatePostInput({ title, content, password, requirePassword }) {
  if (!title || !content) {
    throw new AppError("제목과 내용을 입력해 주세요.", 400);
  }

  if (requirePassword) {
    validatePassword(password);
  }
}

function verifyPassword(existing, password) {
  if (existing.password !== password) {
    throw new AppError("비밀번호가 일치하지 않습니다.", 403);
  }
}

const postService = {
  async getAll() {
    const posts = await postRepository.findAll();
    return posts.map(omitPassword);
  },

  async getById(id) {
    const post = await postRepository.findById(id);

    if (!post) {
      throw new AppError("게시글을 찾을 수 없습니다.", 404);
    }

    return omitPassword(post);
  },

  async create(body) {
    const payload = normalize(body);
    validatePostInput({ ...payload, requirePassword: true });

    const created = await postRepository.create({
      title: payload.title,
      content: payload.content,
      author: payload.author,
      password: payload.password,
    });

    return omitPassword(created);
  },

  async update(id, body) {
    const existing = await postRepository.findById(id);

    if (!existing) {
      throw new AppError("게시글을 찾을 수 없습니다.", 404);
    }

    const payload = normalize(body);
    validatePostInput({ ...payload, requirePassword: true });
    verifyPassword(existing, payload.password);

    const updated = await postRepository.update(id, {
      title: payload.title,
      content: payload.content,
      author: payload.author,
    });

    return omitPassword(updated);
  },

  async remove(id, body = {}) {
    const existing = await postRepository.findById(id);

    if (!existing) {
      throw new AppError("게시글을 찾을 수 없습니다.", 404);
    }

    const { password } = normalize(body);
    validatePassword(password);
    verifyPassword(existing, password);

    await postRepository.delete(id);
  },
};

module.exports = { postService };
