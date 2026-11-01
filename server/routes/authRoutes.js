const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Get currently logged-in user
router.get("/me", protect, getCurrentUser);

module.exports = router;