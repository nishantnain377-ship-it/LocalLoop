
const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
} = require("../controllers/adminController");

const {
  getAllUsers,
  updateUserBlockStatus,
  deleteUser,
} = require("../controllers/userManagementController");

const {
  getAllListings,
  deleteListingByAdmin,
} = require("../controllers/adminListingController");

const router = express.Router();

// Protect all admin routes
router.use(protect, adminOnly);

// Admin dashboard
router.get("/dashboard", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:id/block", updateUserBlockStatus);
router.delete("/users/:id", deleteUser);

// Listing management
router.get("/listings", getAllListings);
router.delete("/listings/:id", deleteListingByAdmin);

module.exports = router;
