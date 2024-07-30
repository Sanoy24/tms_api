const express = require("express");
const {
  createCategory,
  getCategory,
  updateCategory,
} = require("../controllers/category.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/categories/create-categories", authMiddleware, createCategory);
router.get("/categories/get-categories", authMiddleware, getCategory);
router.put("/categories/update/:id", authMiddleware, updateCategory);
module.exports = router;
