import { sendResponse } from "../helpers/format.js";
import * as studioService from "../services/studioService.js";

/* Owner Controllers */

export const createStudioRequestController = async (req, res) => {
  try {
    const studio = await studioService.createStudioRequest(
      req.user._id,
      req.body
    );

    return sendResponse(
      res,
      201,
      true,
      "Studio request submitted successfully",
      { studio }
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

export const getMyStudioController = async (req, res) => {
  try {
    const studio = await studioService.getMyStudio(req.user._id);

    return sendResponse(
      res,
      200,
      true,
      "Studio fetched successfully",
      { studio }
    );
  } catch (error) {
    return sendResponse(res, 404, false, error.message);
  }
};

export const updateStudioController = async (req, res) => {
  try {
    const studio = await studioService.updateStudio(
      req.params.id,
      req.user._id,
      req.body
    );

    return sendResponse(
      res,
      200,
      true,
      "Studio updated successfully",
      { studio }
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

export const deactivateStudioController = async (req, res) => {
  try {
    const studio = await studioService.deactivateStudio(
      req.params.id,
      req.user
    );

    return sendResponse(
      res,
      200,
      true,
      "Studio deactivated successfully",
      { studio }
    );
  } catch (error) {
    return sendResponse(res, 403, false, error.message);
  }
};

/* Superadmin Controllers */

export const getAllStudiosController = async (req, res) => {
  try {
    const studios = await studioService.getAllStudios();

    return sendResponse(
      res,
      200,
      true,
      "Studios fetched successfully",
      { studios }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const getPendingStudiosController = async (req, res) => {
  try {
    const studios = await studioService.getPendingStudios();

    return sendResponse(
      res,
      200,
      true,
      "Pending studios fetched successfully",
      { studios }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const approveStudioController = async (req, res) => {
  try {
    const studio = await studioService.approveStudio(
      req.params.id,
      req.user._id
    );

    return sendResponse(
      res,
      200,
      true,
      "Studio approved successfully",
      { studio }
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

export const rejectStudioController = async (req, res) => {
  try {
    const { reason } = req.body;

    const studio = await studioService.rejectStudio(
      req.params.id,
      reason
    );

    return sendResponse(
      res,
      200,
      true,
      "Studio rejected successfully",
      { studio }
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

export const reactivateStudioController = async (req, res) => {
  try {
    const studio = await studioService.reactivateStudio(
      req.params.id,
      req.user   // ✅ pura user object pass karo
    );

    return sendResponse(
      res,
      200,
      true,
      "Studio reactivated successfully",
      { studio }
    );
  } catch (error) {
    return sendResponse(res, 403, false, error.message);
  }
};

export const updateSubscriptionController = async (req, res) => {
  try {
    const studio = await studioService.updateSubscription(
      req.params.id,
      req.body
    );

    return sendResponse(
      res,
      200,
      true,
      "Subscription updated successfully",
      { studio }
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};