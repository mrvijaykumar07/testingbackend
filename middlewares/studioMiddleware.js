import { Studio } from "../models/studioModel.js";
import mongoose from "mongoose";

// Load Studio (Reusable Middleware)
export const loadStudio = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studio ID",
      });
    }

    const studio = await Studio.findById(id);

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found",
      });
    }

    req.studio = studio;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Allow Only Studio Owner
export const isStudioOwner = (req, res, next) => {
  try {
    const { studio, user } = req;

    if (studio.owner.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not the studio owner.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Allow Studio Owner or SuperAdmin
export const isStudioOwnerOrSuperAdmin = (req, res, next) => {
  try {
    const { studio, user } = req;

    const isOwner =
      studio.owner.toString() === user._id.toString();

    const isSuperAdmin = user.role === "superadmin";

    if (!isOwner && !isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Ensure Studio is Active
export const isStudioActive = (req, res, next) => {
  try {
    if (!req.studio.isActive) {
      return res.status(403).json({
        success: false,
        message: "Studio is inactive",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Ensure Studio Has Active Subscription
export const isStudioSubscribed = (req, res, next) => {
  try {
    if (!req.studio.subscription?.isSubscribed) {
      return res.status(403).json({
        success: false,
        message: "Active subscription required",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Subscription validation failed",
    });
  }
};