const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { getNotifications } = require("../controllers/notification.controller");

router.get("/notifications", authMiddleware, getNotifications);
router.put(
  "/notifications/:id/read",
  authMiddleware,
  notificationController.markAsRead
);

module.exports = router;
