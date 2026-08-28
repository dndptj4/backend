const { Router } = require("express");
const { prisma } = require("../lib/prisma");

const router = Router();

function normalize(body = {}) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const author =
    typeof body.author === "string" && body.author.trim()
      ? body.author.trim()
      : "익명";

  return { title, content, author };
}

router.get("/", async (_req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, content, author } = normalize(req.body);

    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용을 입력해 주세요." });
    }

    const post = await prisma.post.create({
      data: { title, content, author },
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const { title, content, author } = normalize(req.body);

    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용을 입력해 주세요." });
    }

    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: { title, content, author },
    });

    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    await prisma.post.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = { postsRouter: router };
