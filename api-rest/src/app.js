const express = require('express')
// Cargar variables de entorno
require('dotenv').config()
const conectarBD = require('./config/mongoDB')
const dispositivoRoutes = require('./routes/dispositivoRoutes')
const errorHandler = require('./middleware/errorHandler')

// Conectar a la base de datos
conectarBD()
const app = express()
// Middleware para parsear JSON
app.use(express.json())
// Rutas
app.use('/api', dispositivoRoutes)
// Middleware de manejo de errores
app.use(errorHandler)
const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`)
})
// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`)
  // Cerrar el servidor y salir del proceso
  server.close(() => {
    console.log('Servidor cerrado debido a un error no manejado')
    process.exit(1)
  })
})
module.exports = app
