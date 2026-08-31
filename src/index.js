require("dotenv").config();

const express = require("express");
const { postsRouter } = require("./routes/posts");
const { corsMiddleware } = require("./middleware/cors");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Card Board API" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/posts", postsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
