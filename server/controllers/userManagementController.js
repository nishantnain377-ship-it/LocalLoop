
const mongoose = require("mongoose");

const User = require("../models/User");
const Listing = require("../models/Listing");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Escape special characters in search input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all users with search and pagination
const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const filter = {
      role: "user", // Do not expose admin accounts in user management
    };

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        limit,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};

// Block or unblock a user
const updateUserBlockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isBlocked must be true or false.",
      });
    }

    // Prevent admin from blocking their own account
    if (id === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot block your own account.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Protect admin accounts
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be blocked here.",
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: isBlocked
        ? "User blocked successfully."
        : "User unblocked successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user status.",
    });
  }
};

// Delete a user and their associated data
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // Prevent admin from deleting their own account
    if (id === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Protect admin accounts
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted here.",
      });
    }

    // Find conversations involving this user
    const conversations = await Conversation.find({
      participants: user._id,
    }).select("_id");

    const conversationIds = conversations.map(
      (conversation) => conversation._id
    );

    // Delete associated data
    await Promise.all([
      Listing.deleteMany({ seller: user._id }),

      Message.deleteMany({
        conversation: { $in: conversationIds },
      }),

      Conversation.deleteMany({
        _id: { $in: conversationIds },
      }),

      User.findByIdAndDelete(user._id),
    ]);

    return res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete user.",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserBlockStatus,
  deleteUser,
};
