const ModbusRTU = require('modbus-serial')

const modbusService = (ip, port) => {
  const client = new ModbusRTU()

  // Función asíncrona para conectarse al cliente Modbus
  const crearConexion = async (retries = 5, retryDelay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await client.connectTCP(ip, { port })
        console.log(`Conectado al dispositivo modbus: ${ip}:${port}`)
        return
      } catch (error) {
        console.error(`Intentos de conexion fallidos ${i + 1} :`, error)
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }
    }
    throw new Error(`Fallo al conectar al dispositivo modbus: ${ip}:${port} despues de ${retries} intentos`)
  }

  // Función asíncrona para leer los registros Modbus
  const leerRegistrosModbus = async (registros) => {
    const datos = []
    if (!client.isOpen) throw new Error('El cliente no esta conectado')

    try {
      for (let i = 0; i < registros.length; i++) {
        const { data } = await client.readInputRegisters(registros[i].direccionMemoria, registros[i].bytesLeer)
        const valor = data[0] * 65536 + data[1]
        const unidadRegistro = await client.readInputRegisters(registros[i].unidades, 1)
        let exponente = unidadRegistro.data[0]
        if (exponente > 32767) {
          exponente = exponente - 65536 // Convertir a valor con signo si es necesario
        }
        const valorEscalado = valor * Math.pow(10, exponente)
        const dato = {
          nombre: registros[i].nombreRegistro,
          valor: valorEscalado
        }
        datos.push(dato)
      }
      return datos
    } catch (error) {
      console.error(`Error al leer los registros del disposititvo modbus: ${ip}: ${port}`, error)
      return null
    }
  }

  // Función asíncrona para cerrar la conexión
  const cerrarConexion = async () => {
    await client.close()
    console.log(`Conexion Cerrada con el dispositivo modbus: ${ip}:${port}`)
  }

  // Retorno del objeto con los métodos asíncronos
  return {
    crearConexion,
    leerRegistrosModbus,
    cerrarConexion
  }
}

module.exports = modbusService
