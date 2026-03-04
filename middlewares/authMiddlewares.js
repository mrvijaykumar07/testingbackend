import jwt from "jsonwebtoken";
import config from "../config/env.js";
import { sendResponse } from "../helpers/format.js";
import { User } from "../models/userModel.js";

// Authenticate user using JWT (cookie-based)
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;

    if (!token) {
      return sendResponse(
        res,
        401,
        false,
        "Unauthorized",
        null,
        "No access token found"
      );
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return sendResponse(
        res,
        401,
        false,
        "Unauthorized",
        null,
        "Invalid user"
      );
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("jwtToken");

    return sendResponse(
      res,
      401,
      false,
      "Unauthorized",
      null,
      "Invalid or expired session"
    );
  }
};

// SuperAdmin Authorization
export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "superadmin") {
    return sendResponse(
      res,
      403,
      false,
      "Access denied",
      null,
      "SuperAdmin access required"
    );
  }

  next();
};

// Admin Authorization (Admin or SuperAdmin)
export const isAdmin = (req, res, next) => {
  if (!["admin", "superadmin"].includes(req.user?.role)) {
    return sendResponse(
      res,
      403,
      false,
      "Access denied",
      null,
      "Admin access required"
    );
  }

  next();
};

// Paid User Authorization
export const isPaidUser = (req, res, next) => {
  if (!req.user?.isPaidUser) {
    return sendResponse(
      res,
      403,
      false,
      "Access denied",
      null,
      "Paid membership required"
    );
  }

  next();
};

// Subscription-Based Authorization
export const isSubscribedUser = (req, res, next) => {
  if (req.user?.subscriptionTier === "free") {
    return sendResponse(
      res,
      403,
      false,
      "Access denied",
      null,
      "Active subscription required"
    );
  }

  next();
};

// Admin Authentication (Header Token-Based)
export const adminAuthenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return sendResponse(
        res,
        401,
        false,
        "Unauthorized",
        null,
        "No token provided"
      );
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    if (decoded.role !== "admin") {
      return sendResponse(
        res,
        403,
        false,
        "Access denied",
        null,
        "Admin access required"
      );
    }

    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(
      res,
      403,
      false,
      "Unauthorized",
      null,
      "Invalid or expired token"
    );
  }
};