const axios = require('axios')
const API_URL = process.env.API_URL

async function obtenerDispositivos () {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('Error al obtener los dispositivos:', error)
    return []
  }
}

module.exports = { obtenerDispositivos }
