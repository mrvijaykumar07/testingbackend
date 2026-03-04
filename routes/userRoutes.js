import express from "express";
import {
  authenticate,
  isSuperAdmin,
  isAdmin,
} from "../middlewares/authMiddlewares.js";
import {
  userProfileController,
  userProfileUpdateController,
  changeUserRoleController,
  getAllUsersController,
  togglePhotoUploadPermissionController,
  deleteUserController,

  searchUserByEmailController,
  updateUserBySuperAdminController
} from "../controllers/userController.js";

// This router contains all routes for authenticated users it is protected by the authenticate middleware.
const router = express.Router();

// all user route are protected by authenticate middleware.
router.use(authenticate);

// Normal Logged In User Dashboard Routes
router.get("/profile", userProfileController);
router.patch("/profile/update", userProfileUpdateController);
// 🔹 Admin & SuperAdmin can view all users
router.get("/", isSuperAdmin, getAllUsersController);



// 🔹 Only SuperAdmin can change role
router.patch("/:id/role", isSuperAdmin, changeUserRoleController);



router.patch(
  "/:id/upload-permission",
  isAdmin,
  togglePhotoUploadPermissionController,
);


router.delete("/:id", authenticate, deleteUserController);


// Search user by email (SuperAdmin only)
router.get("/admin/search", isSuperAdmin, searchUserByEmailController);

router.patch("/admin/update/:id", isSuperAdmin, updateUserBySuperAdminController);



export default router;
