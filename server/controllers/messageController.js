
const mongoose = require("mongoose");

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Listing = require("../models/Listing");

// Create a new conversation or return an existing one
const createConversation = async (req, res) => {
  try {
    const { listingId } = req.body;
    const buyerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID.",
      });
    }

    const listing = await Listing.findOne({
      _id: listingId,
      status: "active",
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or unavailable.",
      });
    }

    const sellerId = listing.seller;

    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot contact yourself.",
      });
    }

    let conversation = await Conversation.findOne({
      listing: listingId,
      participants: { $all: [buyerId, sellerId], $size: 2 },
    });

    if (!conversation) {
      try {
        conversation = await Conversation.create({
          listing: listingId,
          participants: [buyerId, sellerId],
        });
      } catch (error) {
        if (error.code !== 11000) {
          throw error;
        }

        conversation = await Conversation.findOne({
          listing: listingId,
          participants: { $all: [buyerId, sellerId], $size: 2 },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Conversation ready.",
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create conversation.",
    });
  }
};

// Get all conversations with unread message counts
const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name profileImage")
      .populate("listing", "title images price type")
      .sort({ lastMessageAt: -1 });

    const conversationsWithUnreadCount = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          sender: { $ne: req.user._id },
          readAt: null,
        });

        return {
          ...conversation.toObject(),
          unreadCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      conversations: conversationsWithUnreadCount,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load conversations.",
    });
  }
};

// Get messages and mark received messages as read
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    })
      .populate("participants", "name profileImage")
      .populate("listing", "title images price type");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    // Mark messages from other participants as read
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        readAt: null,
      },
      {
        $set: { readAt: new Date() },
      }
    );

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load messages.",
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    if (text.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 2000 characters.",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim(),
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();

    await conversation.save();

    await message.populate("sender", "name profileImage");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });
  }
};

module.exports = {
  createConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
};
