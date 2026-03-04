import { sendResponse } from "../helpers/format.js";
import * as userService from "../services/userService.js";


// Get Logged-in User Profile
export const userProfileController = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user);

    return sendResponse(
      res,
      200,
      true,
      "User profile fetched successfully",
      { user },
      null
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null, error);
  }
};

// Update Logged-in User Profile
export const userProfileUpdateController = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user._id,
      req.body
    );

    return sendResponse(
      res,
      200,
      true,
      "Profile updated successfully",
      { user: updatedUser },
      null
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message, null, error);
  }
};

// Get All Users (Admin / SuperAdmin)
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    return sendResponse(
      res,
      200,
      true,
      "Users fetched successfully",
      { users },
      null
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null, error);
  }
};

// Change User Role
export const changeUserRoleController = async (req, res) => {
  try {
    const user = await userService.changeUserRole(
      req.params.id,
      req.body.role
    );

    return sendResponse(
      res,
      200,
      true,
      "User role updated successfully",
      { user },
      null
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message, null, error);
  }
};

// Toggle Photo Upload Permission
export const togglePhotoUploadPermissionController = async (req, res) => {
  try {
    const user = await userService.togglePhotoUploadPermission(
      req.params.id,
      req.body.canUploadPhotos
    );

    return sendResponse(
      res,
      200,
      true,
      "Photo upload permission updated successfully",
      { user },
      null
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message, null, error);
  }
};

// Delete User
export const deleteUserController = async (req, res) => {
  try {
    await userService.deleteUser(req.user, req.params.id);

    return sendResponse(
      res,
      200,
      true,
      "User deleted successfully",
      null,
      null
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message, null, error);
  }
};


//  Search User By Email
export const searchUserByEmailController = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email query parameter is required"
      });
    }

    const user = await userService.searchUserByEmailService(email);

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



//  SuperAdmin Partial Update
export const updateUserBySuperAdminController = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await userService.updateUserBySuperAdminService(
      id,
      req.body,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};