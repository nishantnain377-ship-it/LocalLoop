
const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  createConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
} = require("../controllers/messageController");

const router = express.Router();

// All messaging routes require login
router.use(protect);

// Create or get an existing conversation
router.post("/conversations", createConversation);

// Get all conversations of logged-in user
router.get("/conversations", getMyConversations);

// Get messages of a specific conversation
router.get(
  "/conversations/:conversationId/messages",
  getConversationMessages
);

// Send a message
router.post(
  "/conversations/:conversationId/messages",
  sendMessage
);

module.exports = router;
