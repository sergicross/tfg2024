const axios = require('axios')

const THINGSBOARD_URL = process.env.THINGSBOARD_URL
const THINGSBOARD_USER = process.env.THINGSBOARD_USER
const THINGSBOARD_PASS = process.env.THINGSBOARD_PASS

// Obtener el token de acceso para la plataforma thingsboard
async function obtenerTokenAcceso (url, username, password) {
  try {
    const response = await axios.post(`${url}/api/auth/login`, {
      username,
      password
    })

    if (response.status === 200 && response.data && response.data.token) {
      return response.data.token
    } else {
      throw new Error('No se pudo obtener el token de acceso')
    }
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error)
    throw error
  }
}

// Crear instancia de API de ThingsBoard
async function crearThingsboardApi (baseUrl, token) {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      'X-Authorization': `Bearer ${token}`
    }
  })
}

exports.crearDispositivoThingsboard = async (name) => {
  try {
    const token = await obtenerTokenAcceso(THINGSBOARD_URL, THINGSBOARD_USER, THINGSBOARD_PASS)
    const thingsboardApi = await crearThingsboardApi(THINGSBOARD_URL, token)
    const type = 'sensor'
    const deviceProfileId = { entityType: 'DEVICE_PROFILE', id: '06154500-2c14-11ef-a79e-0f85b7901d85' }
    const respuesta = await thingsboardApi.post('/api/device', { name, type, deviceProfileId })
    const thingsboardID = respuesta.data.id.id

    // Obtener el token de acceso del dispositivo
    const tokenResponse = await thingsboardApi.get(`/api/device/${thingsboardID}/credentials`)

    return {
      thingsboardID,
      accessTokenThingsboard: tokenResponse.data.credentialsId
    }
  } catch (error) {
    console.error('Error al crear dispositivo en ThingsBoard:', error.response?.data || error.message)
    throw new Error('Error al crear dispositivo en ThingsBoard')
  }
}

exports.modificarNombreDispositivoThingsboard = async (thingsboardID, nuevoNombre) => {
  try {
    const token = await obtenerTokenAcceso(THINGSBOARD_URL, THINGSBOARD_USER, THINGSBOARD_PASS)
    const thingsboardApi = await crearThingsboardApi(THINGSBOARD_URL, token)
    // Primero, obtenemos los detalles actuales del dispositivo
    const datosAntiguos = await thingsboardApi.get(`/api/device/${thingsboardID}`)

    // Actualizamos solo el nombre del dispositivo
    const datosActualizados = {
      ...datosAntiguos.data,
      name: nuevoNombre
    }

    const respuesta = await thingsboardApi.post('/api/device', datosActualizados)

    console.log('Dispositivo renombrado con éxito')
    return respuesta.data
  } catch (error) {
    console.error('Error al renombrar el dispositivo:', error.respuesta ? error.respuesta.data : error.message)
    throw error
  }
}

exports.eliminarDispositivoThingsboard = async (thingsboardID) => {
  try {
    const token = await obtenerTokenAcceso(THINGSBOARD_URL, THINGSBOARD_USER, THINGSBOARD_PASS)
    const thingsboardApi = await crearThingsboardApi(THINGSBOARD_URL, token)
    await thingsboardApi.delete(`/api/device/${thingsboardID}`)
  } catch (error) {
    console.error('Error al eliminar dispositivo de ThingsBoard:', error.response?.data || error.message)
    throw new Error('Error al eliminar dispositivo de ThingsBoard')
  }
}
