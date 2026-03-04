import { User } from "../models/userModel.js";



// Get User Profile
export const getUserProfile = async (user) => {
  return user;
};

// Update User Profile
export const updateUserProfile = async (userId, updates) => {
  const allowedFields = [
    "name",
    "dob",
    "gender",
    "bio",
    "phone",
    "city",
    "state",
    "latitude",
    "longitude",
    "preferred_language",
    "exam_preparing_for",
    "profile_picture_url",
  ];

  const updateKeys = Object.keys(updates).filter((key) =>
    allowedFields.includes(key)
  );

  if (updateKeys.length === 0) {
    throw new Error("No valid fields provided for update.");
  }

  const updateObject = {};
  updateKeys.forEach((key) => {
    updateObject[key] = updates[key];
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateObject,
    { new: true }
  );

  return updatedUser;
};

// Get All Users
export const getAllUsers = async () => {
  return User.find().select("name email role");
};

// Change User Role
export const changeUserRole = async (userId, role) => {
  if (!["admin", "user"].includes(role)) {
    throw new Error("Invalid role specified.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

// Toggle Photo Upload Permission
export const togglePhotoUploadPermission = async (
  userId,
  canUploadPhotos
) => {
  if (typeof canUploadPhotos !== "boolean") {
    throw new Error("Invalid value for upload permission.");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.canUploadPhotos = canUploadPhotos;
  await user.save();

  return user;
};

// Delete User (Role-Based Access Control)
export const deleteUser = async (requester, targetUserId) => {
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new Error("User not found.");
  }

  if (requester.role === "user") {
    throw new Error("Access denied.");
  }

  if (
    requester.role === "admin" &&
    targetUser.role === "superadmin"
  ) {
    throw new Error("Cannot delete a SuperAdmin.");
  }

  if (
    requester.role === "admin" &&
    targetUser.role === "admin"
  ) {
    throw new Error("Admin cannot delete another Admin.");
  }

  if (
    requester._id.toString() === targetUser._id.toString()
  ) {
    throw new Error("You cannot delete your own account.");
  }

  await targetUser.deleteOne();

  return true;
};



// 🔎 Search by Email
export const searchUserByEmailService = async (email) => {

  const user = await User.findOne({ email }).select("-refreshToken");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};



// ✏ SuperAdmin Update (PATCH style)
export const updateUserBySuperAdminService = async (
  id,
  updateData,
  loggedInUser
) => {

  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  // 🔒 Prevent SuperAdmin self role change
  if (
    user._id.toString() === loggedInUser._id.toString() &&
    updateData.role &&
    updateData.role !== user.role
  ) {
    throw new Error("You cannot change your own role");
  }

  // 🔒 Allowed fields
  const allowedFields = [
    "name",
    "phone",
    "role",
    "uploadPermission",
    "isBlocked"
  ];

  Object.keys(updateData).forEach((key) => {
    if (allowedFields.includes(key)) {
      user[key] = updateData[key];
    }
  });

  await user.save();

  return user;
};
