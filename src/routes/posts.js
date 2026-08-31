const { Router } = require("express");
const { postController } = require("../controllers/postController");
const { authorizeCardPassword } = require("../middleware/authorizeCardPassword");
const { requirePassword } = require("../middleware/requirePassword");

const router = Router();

router.get("/", postController.list);
router.get("/:id", postController.getById);
router.post("/", requirePassword, postController.create);
router.put("/:id", authorizeCardPassword, postController.update);
router.delete("/:id", authorizeCardPassword, postController.remove);

module.exports = { postsRouter: router };
