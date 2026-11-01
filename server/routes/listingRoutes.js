
const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  createListing,
  getListings,
  getSingleListing,
  getMyListings,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");

const router = express.Router();

// Get all active listings
router.get("/", getListings);

// Get my listings (login required)
router.get("/user/my-listings", protect, getMyListings);

// Create listing (login required)
router.post("/", protect, createListing);

// Update listing (login required)
router.put("/:id", protect, updateListing);

// Delete listing (login required)
router.delete("/:id", protect, deleteListing);

// Get single listing
router.get("/:id", getSingleListing);

module.exports = router;
