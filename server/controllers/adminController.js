
const User = require("../models/User");
const Listing = require("../models/Listing");
const Conversation = require("../models/Conversation");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalListings,
      activeListings,
      soldListings,
      totalConversations,
      recentUsers,
      recentListings,
    ] = await Promise.all([
      User.countDocuments(),

      Listing.countDocuments(),

      Listing.countDocuments({ status: "active" }),

      Listing.countDocuments({ status: "sold" }),

      Conversation.countDocuments(),

      User.find()
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .limit(5),

      Listing.find()
        .select("title price category status createdAt")
        .populate("seller", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalListings,
        activeListings,
        soldListings,
        totalConversations,
      },
      recentUsers,
      recentListings,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load dashboard statistics.",
    });
  }
};

module.exports = {
  getDashboardStats,
};
