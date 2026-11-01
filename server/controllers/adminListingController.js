
const mongoose = require("mongoose");
const Listing = require("../models/Listing");

// Get all marketplace listings with search, filters and pagination
const getAllListings = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const category = req.query.category || "";
    const status = req.query.status || "";

    const page = Math.max(
      1,
      Number.parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const filter = {};

    // Search by listing title
    if (search) {
      filter.title = {
        $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    const [listings, totalListings] = await Promise.all([
      Listing.find(filter)
        .populate("seller", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Listing.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      listings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalListings / limit),
        totalListings,
        limit,
      },
    });
  } catch (error) {
    console.error("Admin get listings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch marketplace listings.",
    });
  }
};

// Delete any marketplace listing
const deleteListingByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID.",
      });
    }

    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete listing.",
    });
  }
};

module.exports = {
  getAllListings,
  deleteListingByAdmin,
};
