require('dotenv').config()
const { obtenerDispositivos } = require('./obtenerDispositivos')
const { operacionesDisposiivo } = require('./operacionesDispositivo')

async function main () {
  try {
    const respuesta = await obtenerDispositivos()
    const dispositivos = respuesta.data
    await Promise.all(dispositivos.map(operacionesDisposiivo))
  } catch (error) {
    console.error('Error:', error)
  }
}

async function ejecutarYProgramarSiguiente () {
  await main()
  setTimeout(ejecutarYProgramarSiguiente, 1 * 60 * 1000) // Programa la siguiente ejecución después de 1 minuto
}

// Inicia el ciclo
ejecutarYProgramarSiguiente().catch(console.error)
