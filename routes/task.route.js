const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateStatus,
} = require("../controllers/task.controller");
const {
  addComment,
  getComments,
} = require("../controllers/comment.controller");
router.post("/create-task", authMiddleware, createTask);
router.get("/tasks", authMiddleware, getTasks);
router.put("/tasks/update-task/:id", authMiddleware, updateTask);
router.delete("/tasks/delete-task/:id", authMiddleware, deleteTask);
router.put("/tasks/:id/status", authMiddleware, updateStatus);
router.post("/tasks/:taskId/add-comment", authMiddleware, addComment);
router.get("/tasks/:taskId/comments", authMiddleware, getComments);

module.exports = router;
