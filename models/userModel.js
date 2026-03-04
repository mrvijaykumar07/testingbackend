import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    google_id: { type: String },
    profile_picture_url: { type: String },

    // Profile Details
    dob: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    bio: { type: String, maxLength: 200 },
    phone: { type: String },

    // Role & Access Control
    role: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "user",
      index: true,
    },

    // Subscription & Permissions
    isPaidUser: { type: Boolean, default: false },
    subscriptionTier: { type: String, default: "free" },
    canUploadPhotos: { type: Boolean, default: false },

    // Account Status
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);