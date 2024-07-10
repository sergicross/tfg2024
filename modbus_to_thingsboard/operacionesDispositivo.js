const modbusService = require('./modbusService')
const mqttService = require('./mqttService')

async function operacionesDisposiivo (dispositivo) {
  const clienteModbus = modbusService(dispositivo.ip, dispositivo.puerto)
  let clienteMQTT

  try {
    await clienteModbus.crearConexion()
    clienteMQTT = await mqttService.crearClienteMQTT(dispositivo.accessTokenThingsboard)

    const datos = await clienteModbus.leerRegistrosModbus(dispositivo.registros)
    const telemetry = {}

    if (datos) {
      for (const dato of datos) {
        const nombre = dato.nombre.replace(/'/g, '"')
        telemetry[nombre] = dato.valor
      }
    }

    console.log(telemetry)
    await mqttService.publicarTelemetria(clienteMQTT, dispositivo.accessTokenThingsboard, telemetry)
  } catch (error) {
    console.error(`Error al procesar dispositivo ${dispositivo.ip}:`, error)
  } finally {
    clienteModbus.cerrarConexion()
    mqttService.cerrarClienteMQTT(clienteMQTT)
  }
}

module.exports = { operacionesDisposiivo }
