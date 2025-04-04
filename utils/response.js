export const response = (res, statusCode, error = null, data = null) => {
  const statusMessages = {
    200: "Success",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error",
  };

  const finalStatusCode = statusMessages[statusCode] ? statusCode : 500;
  const errorMessage = error instanceof Error ? error.message : error;

  return res.status(finalStatusCode).json({
    success: finalStatusCode >= 200 && finalStatusCode < 300,
    message: errorMessage || statusMessages[finalStatusCode],
    error: error || null,
    data: data || null,
  });
};
