import config from "../config/env.js";
import { sendResponse } from "../helpers/format.js";

export const verifyClientSecret = async (req, res, next) => {
  const token = req.headers["client_secret"];

  if (!token) {
    return sendResponse(
      res,
      403,
      false,
      "Unauthorized",
      null,
      "Client secret is required"
    );
  }

  if (token !== config.clientSecret) {
    return sendResponse(
      res,
      403,
      false,
      "Unauthorized",
      null,
      "Invalid client request"
    );
  }

  next();
};