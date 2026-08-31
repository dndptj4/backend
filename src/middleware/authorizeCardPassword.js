const { AppError } = require("../errors/AppError");
const { postRepository } = require("../repositories/postRepository");

function extractPassword(body = {}) {
  return typeof body.password === "string" ? body.password.trim() : "";
}

async function authorizeCardPassword(req, _res, next) {
  try {
    const card = await postRepository.findById(req.params.id);

    if (!card) {
      throw new AppError("게시글을 찾을 수 없습니다.", 404);
    }

    const password = extractPassword(req.body);

    if (!password) {
      throw new AppError("비밀번호를 입력해 주세요.", 400);
    }

    if (card.password !== password) {
      throw new AppError("비밀번호가 일치하지 않습니다.", 403);
    }

    req.card = card;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authorizeCardPassword };
