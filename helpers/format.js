import json from 'json';

export const sendResponse = (res, statusCode, success, message, data = null, errors = null) => {
  const response = { success, message };
  if (data) response.data = data;
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

