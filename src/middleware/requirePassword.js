const { AppError } = require("../errors/AppError");

function requirePassword(req, _res, next) {
  const password =
    typeof req.body.password === "string" ? req.body.password.trim() : "";

  if (!password) {
    return next(new AppError("비밀번호를 입력해 주세요.", 400));
  }

  next();
}

module.exports = { requirePassword };
