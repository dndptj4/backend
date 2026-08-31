const { AppError } = require("../errors/AppError");

function errorHandler(err, _req, res, _next) {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS 정책에 의해 차단되었습니다." });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      message: "DATABASE_URL이 없습니다. backend/.env에 Supabase 연결 정보를 넣어 주세요.",
    });
  }

  console.error(err);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
}

module.exports = { errorHandler };
