import { Studio } from "../models/studioModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

/* Owner Services */

export const createStudioRequest = async (userId, data) => {
  const existingStudio = await Studio.findOne({ owner: userId });

  if (existingStudio) {
    throw new Error("You already have a studio.");
  }

  const studio = await Studio.create({
    ...data,
    owner: userId,
    status: "pending",
  });

  return studio;
};

export const getMyStudio = async (userId) => {
  const studio = await Studio.findOne({ owner: userId })
    .populate("owner", "name email")
    .populate("approvedBy", "name email");

  if (!studio) {
    throw new Error("Studio not found.");
  }

  return studio;
};

export const updateStudio = async (studioId, userId, data) => {
  if (!mongoose.Types.ObjectId.isValid(studioId)) {
    throw new Error("Invalid studio ID.");
  }

  const studio = await Studio.findById(studioId);

  if (!studio) {
    throw new Error("Studio not found.");
  }

  if (studio.owner.toString() !== userId.toString()) {
    throw new Error("Access denied.");
  }

  if (studio.status === "pending") {
    throw new Error("Studio is currently under review.");
  }

  if (studio.status === "rejected") {
    studio.status = "pending";
    studio.approvedBy = null;
    studio.approvedAt = null;
  }

  const allowedFields = [
    "studioName",
    "logo",
    "description",
    "officialEmail",
    "officialPhone",
    "website",
    "address",
    "city",
    "state",
    "pincode",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      studio[field] = data[field];
    }
  });

  await studio.save();
  return studio;
};

export const deactivateStudio = async (studioId, user) => {
  const studio = await Studio.findById(studioId);

  if (!studio) {
    throw new Error("Studio not found.");
  }

  const isOwner =
    studio.owner.toString() === user._id.toString();
  const isSuperAdmin = user.role === "superadmin";

  if (!isOwner && !isSuperAdmin) {
    throw new Error("Access denied.");
  }

  if (!studio.isActive) {
    throw new Error("Studio is already inactive.");
  }

  studio.isActive = false;
  studio.deactivatedAt = new Date();
  studio.deactivatedBy = user._id;

  await studio.save();
  return studio;
};

/* Superadmin Services */

export const getAllStudios = async () => {
  return Studio.find()
    .populate("owner", "name email role")
    .sort({ createdAt: -1 });
};

export const getPendingStudios = async () => {
  return Studio.find({ status: "pending" })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });
};

export const approveStudio = async (studioId, superAdminId) => {
  const studio = await Studio.findById(studioId);

  if (!studio) {
    throw new Error("Studio not found.");
  }

  if (studio.status !== "pending") {
    throw new Error("Studio has already been processed.");
  }

  studio.status = "approved";
  studio.approvedBy = superAdminId;
  studio.approvedAt = new Date();
  studio.rejectionReason = null;

  studio.subscription.isSubscribed = true;
  studio.subscription.startedAt = new Date();
  studio.subscription.expiresAt = null;

  await studio.save();

  await User.findByIdAndUpdate(studio.owner, {
    role: "admin",
  });

  return studio;
};

export const rejectStudio = async (studioId, reason) => {
  const studio = await Studio.findById(studioId);

  if (!studio) {
    throw new Error("Studio not found.");
  }

  if (studio.status !== "pending") {
    throw new Error("Studio has already been processed.");
  }

  if (!reason) {
    throw new Error("Rejection reason is required.");
  }

  studio.status = "rejected";
  studio.rejectionReason = reason;
  studio.approvedBy = null;
  studio.approvedAt = null;

  await studio.save();
  return studio;
};

export const reactivateStudio = async (studioId, user) => {
  const studio = await Studio.findById(studioId);

  if (!studio) {
    throw new Error("Studio not found.");
  }

  // Already active check
  if (studio.isActive) {
    throw new Error("Studio is already active.");
  }

  // Permission check
  const isSuperAdmin = user.role === "superadmin";
  const isDeactivatedBySameUser =
    studio.deactivatedBy &&
    studio.deactivatedBy.toString() === user._id.toString();

  if (!isSuperAdmin && !isDeactivatedBySameUser) {
    throw new Error(
      "You are not allowed to reactivate this studio."
    );
  }

  // Reactivate
  studio.isActive = true;
  studio.deactivatedAt = null;
  studio.deactivatedBy = null;

  await studio.save();

  return studio;
};

export const updateSubscription = async (studioId, data) => {
  const studio = await Studio.findById(studioId);

  if (!studio) {
    throw new Error("Studio not found.");
  }

  const { isSubscribed, durationInDays } = data;

  if (typeof isSubscribed !== "boolean") {
    throw new Error("isSubscribed must be a boolean value.");
  }

  if (isSubscribed) {
    const now = new Date();
    const expiry = new Date();

    expiry.setDate(
      expiry.getDate() + (durationInDays || 30)
    );

    studio.subscription.isSubscribed = true;
    studio.subscription.startedAt = now;
    studio.subscription.expiresAt = expiry;
  } else {
    studio.subscription.isSubscribed = false;
    studio.subscription.startedAt = null;
    studio.subscription.expiresAt = null;
  }

  await studio.save();
  return studio;
};