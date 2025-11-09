export const handleError = (res, error, defaultMessage = "Server error") => {
  console.error(error);
  res
    .status(error.statusCode || 500)
    .json({ message: error.message || defaultMessage });
};

export const handleNotFound = (res, message = "Resource not found") => {
  res.status(404).json({ message });
};

export const handleSuccess = (res, data, status = 200) => {
  res.status(status).json(data);
};
