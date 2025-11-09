// utils/responseHandler.js
export const handleSuccess = (res, data, message = "Success", status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const handleError = (res, error, defaultMessage = "Server error") => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || defaultMessage,
  });
};

export const handleNotFound = (res, message = "Resource not found") => {
  res.status(404).json({
    success: false,
    message,
  });
};
