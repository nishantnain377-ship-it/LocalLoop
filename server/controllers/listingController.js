
const Listing = require("../models/Listing");

// CREATE LISTING
const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      price,
      city,
      locality,
      pincode,
      images,
    } = req.body;

    // Required field validation
    if (
      !title ||
      !description ||
      !category ||
      !type ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const productPrice = Number(price);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid price.",
      });
    }

    if (type === "Free" && productPrice !== 0) {
      return res.status(400).json({
        success: false,
        message: "Free listings must have a price of zero.",
      });
    }

    if (type !== "Free" && productPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Sale and Rent listings need a price greater than zero.",
      });
    }

    const listing = await Listing.create({
      title,
      description,
      category,
      type,
      price: type === "Free" ? 0 : productPrice,
      city,
      locality: locality || "",
      pincode: pincode || "",
      images: Array.isArray(images) ? images : [],
      seller: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully.",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create listing.",
    });
  }
};

// GET ALL ACTIVE LISTINGS
const getListings = async (req, res) => {
  try {
    const {
      search,
      category,
      categories,
      type,
      types,
      sort = "latest",
      page = 1,
      limit = 12,
    } = req.query;

    // Only show active listings
    const filter = {
      status: "active",
    };

    // Search in title and description
    if (search && search.trim()) {
      filter.$text = {
        $search: search.trim(),
      };
    }

    // Support multiple categories
    const categoryList = categories
      ? categories.split(",").map((item) => item.trim()).filter(Boolean)
      : category
        ? [category.trim()]
        : [];

    if (categoryList.length > 0) {
      filter.category = {
        $in: categoryList,
      };
    }

    // Support multiple listing types
    const typeList = types
      ? types.split(",").map((item) => item.trim()).filter(Boolean)
      : type
        ? [type.trim()]
        : [];

    if (typeList.length > 0) {
      filter.type = {
        $in: typeList,
      };
    }

    // Pagination validation
    const pageNumber = Math.max(1, Number(page) || 1);

    const pageLimit = Math.min(
      50,
      Math.max(1, Number(limit) || 12)
    );

    // Sorting options
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "lowToHigh") {
      sortOption = {
        price: 1,
      };
    } else if (sort === "highToLow") {
      sortOption = {
        price: -1,
      };
    }

    // Fetch filtered listings from MongoDB
    const listings = await Listing.find(filter)
      .populate("seller", "name locality city")
      .sort(sortOption)
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);

    // Count all matching listings
    const totalListings = await Listing.countDocuments(filter);

    return res.status(200).json({
      success: true,
      totalListings,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalListings / pageLimit),
      listings,
    });
  } catch (error) {
    console.error("Get listings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch listings.",
    });
  }
};

// GET SINGLE LISTING
const getSingleListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("seller", "name locality city");

    if (!listing || listing.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid listing ID.",
    });
  }
};

// GET LOGGED-IN USER LISTINGS
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      seller: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("My listings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your listings.",
    });
  }
};

// UPDATE LISTING
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot update another user's listing.",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "type",
      "price",
      "locality",
      "city",
      "pincode",
      "images",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    if (listing.type === "Free") {
      listing.price = 0;
    } else if (
      !Number.isFinite(listing.price) ||
      listing.price <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Sale and Rent listings need a valid price.",
      });
    }

    await listing.save();

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully.",
      listing,
    });
  } catch (error) {
    console.error("Update listing error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Unable to update listing. Check the submitted data.",
    });
  }
};

// DELETE LISTING
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete another user's listing.",
      });
    }

    await listing.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully.",
    });
  } catch (error) {
    console.error("Delete listing error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Unable to delete listing.",
    });
  }
};

module.exports = {
  createListing,
  getListings,
  getSingleListing,
  getMyListings,
  updateListing,
  deleteListing,
};
