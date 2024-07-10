const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  let statusCode = err.statusCode || 500
  let message = err.message || 'Error interno del servidor'

  // Manejar errores específicos de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map(val => val.message).join(', ')
  } else if (err.code === 11000) {
    statusCode = 400
    message = 'Ya existe un registro con esos datos únicos'
  }

  res.status(statusCode).json({
    success: false,
    error: message
  })
}

module.exports = errorHandler
