const mongoose = require('mongoose')
const conectarBD = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Conexión exitosa a MongoDB')
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = conectarBD
