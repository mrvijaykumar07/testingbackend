import express from "express";
import { authenticate, isSuperAdmin } from "../middlewares/authMiddlewares.js";
import {
  loadStudio,
  isStudioOwner,
  isStudioOwnerOrSuperAdmin,
} from "../middlewares/studioMiddleware.js";

import {
  createStudioRequestController,
  getMyStudioController,
  updateStudioController,
  getPendingStudiosController,
  getAllStudiosController,
  approveStudioController,
  rejectStudioController,
  deactivateStudioController,
  reactivateStudioController,
  updateSubscriptionController,
} from "../controllers/studioController.js";

const router = express.Router();

router.use(authenticate);


router.post("/request", createStudioRequestController);
router.get("/my", getMyStudioController);
router.patch("/:id/update", loadStudio, isStudioOwner, updateStudioController);



router.get("/", isSuperAdmin, getAllStudiosController);
router.get("/pending", isSuperAdmin, getPendingStudiosController);
router.patch("/:id/approve", isSuperAdmin, approveStudioController);
router.patch("/:id/reject", isSuperAdmin, rejectStudioController);

router.patch("/:id/deactivate",loadStudio,isStudioOwnerOrSuperAdmin,deactivateStudioController,);
router.patch("/:id/reactivate",loadStudio,isStudioOwnerOrSuperAdmin,reactivateStudioController,);


router.patch("/:id/subscription",isSuperAdmin,loadStudio,updateSubscriptionController,);

export default router;
