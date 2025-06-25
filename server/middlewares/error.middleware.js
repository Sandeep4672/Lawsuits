export const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  let errorMessage = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message);
    errorMessage = errors.join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(isProd ? {} : { error: err, stack: err.stack }),
  });
};
