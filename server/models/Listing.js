
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Furniture",
        "Vehicles",
        "Fashion",
        "Books",
        "Home Appliances",
        "Other",
      ],
    },

    type: {
      type: String,
      required: true,
      enum: ["Sale", "Rent", "Free"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    locality: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      required: true,
    },

    pincode: {
      type: String,
      trim: true,
      default: "",
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "sold", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Search optimization
listingSchema.index({
  title: "text",
  description: "text",
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
