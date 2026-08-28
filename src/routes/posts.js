const { Router } = require("express");
const { postController } = require("../controllers/postController");

const router = Router();

router.get("/", postController.list);
router.get("/:id", postController.getById);
router.post("/", postController.create);
router.put("/:id", postController.update);
router.delete("/:id", postController.remove);

module.exports = { postsRouter: router };
