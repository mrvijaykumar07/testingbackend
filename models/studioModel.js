import mongoose from "mongoose";

const studioSchema = new mongoose.Schema(
  {
    // Basic Information
    studioName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    logo: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      maxlength: 500,
      default: null,
    },

    // Owner Reference
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Public Business Contact
    officialEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    officialPhone: {
      type: String,
      required: true,
    },

    website: {
      type: String,
      default: null,
    },

    // Address Details
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    pincode: { type: String, default: null },

    // Approval Workflow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    // Subscription
    subscription: {
      isSubscribed: {
        type: Boolean,
        default: false,
      },
      startedAt: {
        type: Date,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
    },

    // Soft Deactivation
    isActive: {
      type: Boolean,
      default: true
    },

    deactivatedAt: {
      type: Date,
      default: null,
    },

    deactivatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);


// ✅ Centralized Indexes (No Duplicate Now)
studioSchema.index({ owner: 1 });
studioSchema.index({ status: 1 });
studioSchema.index({ isActive: 1 });
studioSchema.index({ "subscription.isSubscribed": 1 });


// Virtual: Checks if subscription is currently active
studioSchema.virtual("isSubscriptionActive").get(function () {
  if (!this.subscription.isSubscribed) return false;

  if (
    this.subscription.expiresAt &&
    this.subscription.expiresAt < new Date()
  ) {
    return false;
  }

  return true;
});

export const Studio = mongoose.model("Studio", studioSchema);