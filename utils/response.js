export const response = (res, statusCode, error = null, data = null) => {
  const statusMessages = {
    200: "Success",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  const finalStatusCode = statusMessages[statusCode] ? statusCode : 500;

  return res.status(finalStatusCode).json({
    success: !error,
    message: error
      ? error.message || error || statusMessages[finalStatusCode]
      : statusMessages[finalStatusCode],
    error: error || null,
    data: data || null,
  });
};
