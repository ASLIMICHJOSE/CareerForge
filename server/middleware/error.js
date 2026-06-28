export function errorHandler(err, req, res, next) {
  // Log details locally
  console.error(`[Error] [${req.method} ${req.url}]:`, err.stack || err.message || err)

  const status = err.status || err.statusCode || 500
  
  // Safe sanitized response payload to client
  res.status(status).json({
    error: err.message || 'An unexpected server error occurred.',
    status
  })
}
