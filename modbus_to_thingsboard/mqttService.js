const mqtt = require('mqtt')

const MQTT_BROKER_THINGSBOARD = process.env.MQTT_BROKER_THINGSBOARD

function crearClienteMQTT (accessTokenThingsboard) {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect(`mqtt://${MQTT_BROKER_THINGSBOARD}`, {
      username: accessTokenThingsboard
    })

    client.on('connect', () => {
      console.log(`Conectado al broker MQTT de thingsboard para el dispositivo con token ${accessTokenThingsboard}`)
      resolve(client)
    })

    client.on('error', (error) => {
      console.error('Error de conexión MQTT de thingsboard:', error)
      reject(error)
    })
  })
}

async function publicarTelemetria (client, accessTokenThingsboard, datos) {
  const topic = 'v1/devices/me/telemetry'

  return new Promise((resolve, reject) => {
    client.publish(topic, JSON.stringify(datos), { qos: 1 }, (error) => {
      if (error) {
        console.error('Error al publicar telemetría:', error)
        reject(error)
      } else {
        console.log(`Telemetría publicada para el dispositivo ${accessTokenThingsboard}`)
        resolve()
      }
    })
  })
}

function cerrarClienteMQTT (client) {
  client.end()
}

module.exports = {
  crearClienteMQTT,
  publicarTelemetria,
  cerrarClienteMQTT
}
