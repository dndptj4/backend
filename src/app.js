require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { postsRouter } = require("./routes/posts");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/posts", postsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "요청한 경로를 찾을 수 없습니다." });
});

app.use((err, _req, res, _next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS 정책에 의해 차단되었습니다." });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      message: "DATABASE_URL이 없습니다. backend/.env에 Supabase 연결 정보를 넣어 주세요.",
    });
  }

  console.error(err);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
});

module.exports = { app };
