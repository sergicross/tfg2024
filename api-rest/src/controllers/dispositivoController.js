const Dispositivo = require('../models/dispositivo')
const thingsboardService = require('../services/thingsboardService')

exports.obtenerTodosDispositivos = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La solicitud no debe contener parámetros en el cuerpo.'
      })
    }
    const dispositivos = await Dispositivo.find()
    res.status(200).json({
      success: true,
      count: dispositivos.length,
      data: dispositivos
    })
  } catch (error) {
    next(error)
  }
}

exports.obtenerDispositivoID = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La solicitud no debe contener parámetros en el cuerpo.'
      })
    }
    const dispositivo = await Dispositivo.findById(req.params.id)
    if (!dispositivo) {
      return res.status(404).json({
        success: false,
        message: 'Dispositivo no encontrado'
      })
    }
    res.status(200).json({
      success: true,
      data: dispositivo
    })
  } catch (error) {
    next(error)
  }
}

exports.obtenerDispositivoNombre = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La solicitud no debe contener parámetros en el cuerpo.'
      })
    }
    const nombreDispositivo = req.params.nombre
    const dispositivo = await Dispositivo.findOne({ nombre: nombreDispositivo })
    if (!dispositivo) {
      return res.status(404).json({
        success: false,
        message: 'Dispositivo no encontrado'
      })
    }
    res.status(200).json({
      success: true,
      data: dispositivo
    })
  } catch (error) {
    next(error)
  }
}

exports.obtenerDispositivoIP = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La solicitud no debe contener parámetros en el cuerpo.'
      })
    }
    const dispositivo = await Dispositivo.findOne({ ip: req.params.ip })
    if (!dispositivo) {
      return res.status(404).json({
        success: false,
        message: 'Dispositivo no encontrado'
      })
    }
    res.status(200).json({
      success: true,
      data: dispositivo
    })
  } catch (error) {
    next(error)
  }
}

exports.crearDispositivo = async (req, res, next) => {
  let dispositivoThingsboard = null

  // Campos permitidos a nivel de dispositivo
  const camposDispositivoPermitidos = ['nombre', 'ip', 'puerto', 'registros']

  // Campos permitidos dentro de registros
  const camposRegistroPermitidos = ['nombreRegistro', 'direccionMemoria', 'bytesLeer', 'unidades']

  try {
    const resultado = req.body

    // Validar que solo se envíen campos permitidos a nivel de dispositivo
    const camposDispositivoRecibidos = Object.keys(req.body)
    const camposDispositivoInvalidos = camposDispositivoRecibidos.filter(field => !camposDispositivoPermitidos.includes(field))

    if (camposDispositivoInvalidos.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Existen campos no permitidos en la peticion POST: ${camposDispositivoInvalidos.join(', ')}`
      })
    }

    // Validar que solo se envíen campos permitidos dentro de registros
    if (resultado.registros && Array.isArray(resultado.registros)) {
      for (const registro of resultado.registros) {
        const camposRegistroRecibidos = Object.keys(registro)
        const camposRegistroInvalidos = camposRegistroRecibidos.filter(field => !camposRegistroPermitidos.includes(field))

        if (camposRegistroInvalidos.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Existen campos no permitidos en la peticion POST dentro del campo registros: ${camposRegistroInvalidos.join(', ')}`
          })
        }
      }
    }

    // Crear dispositivo en ThingsBoard
    dispositivoThingsboard = await thingsboardService.crearDispositivoThingsboard(resultado.nombre)

    // Crear dispositivo en nuestra base de datos
    const dispositivo = new Dispositivo({
      ...resultado,
      thingsboardID: dispositivoThingsboard.thingsboardID,
      accessTokenThingsboard: dispositivoThingsboard.accessTokenThingsboard // Añadir registros si existen
    })

    await dispositivo.save()

    res.status(201).json({
      success: true,
      data: dispositivo
    })
  } catch (error) {
    if (dispositivoThingsboard) {
      try {
        // Eliminar dispositivo de ThingsBoard si ocurre un error
        await thingsboardService.eliminarDispositivoThingsboard(dispositivoThingsboard.thingsboardID)
      } catch (deletionError) {
        // Log del error al eliminar el dispositivo de ThingsBoard
        console.error('Error al eliminar el dispositivo de ThingsBoard:', deletionError)
      }
    }
    next(error)
  }
}

exports.actualizarDispositivo = async (req, res, next) => {
  // Campos permitidos a nivel de dispositivo
  const camposDispositivoPermitidos = ['nombre', 'ip', 'puerto', 'registros']

  // Campos permitidos dentro de registros
  const camposRegistroPermitidos = ['nombreRegistro', 'direccionMemoria', 'bytesLeer', 'unidades']
  try {
    const { id } = req.params
    const datosActualizados = req.body
    // Validar que solo se envíen campos permitidos a nivel de dispositivo
    const camposDispositivoRecibidos = Object.keys(req.body)
    const camposDispositivoInvalidos = camposDispositivoRecibidos.filter(field => !camposDispositivoPermitidos.includes(field))

    if (camposDispositivoInvalidos.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Existen campos no permitidos en la peticion POST: ${camposDispositivoInvalidos.join(', ')}`
      })
    }

    // Validar que solo se envíen campos permitidos dentro de registros
    if (datosActualizados.registros && Array.isArray(datosActualizados.registros)) {
      for (const registro of datosActualizados.registros) {
        const camposRegistroRecibidos = Object.keys(registro)
        const camposRegistroInvalidos = camposRegistroRecibidos.filter(field => !camposRegistroPermitidos.includes(field))

        if (camposRegistroInvalidos.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Existen campos no permitidos en la peticion POST dentro del campo registros: ${camposRegistroInvalidos.join(', ')}`
          })
        }
      }
    }
    const dispositivo = await Dispositivo.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true })
    if (!dispositivo) {
      return res.status(404).json({
        success: false,
        message: 'Dispositivo no encontrado'
      })
    }
    await thingsboardService.modificarNombreDispositivoThingsboard(dispositivo.thingsboardID, dispositivo.nombre)

    res.status(200).json({
      success: true,
      data: dispositivo
    })
  } catch (error) {
    next(error)
  }
}

exports.borrarDispositivo = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La solicitud no debe contener parámetros en el cuerpo.'
      })
    }
    const dispositivo = await Dispositivo.findOneAndDelete({ _id: req.params.id })
    if (!dispositivo) {
      return res.status(404).json({
        success: false,
        message: 'Dispositivo no encontrado'
      })
    }

    // Eliminar dispositivo de ThingsBoard
    await thingsboardService.eliminarDispositivoThingsboard(dispositivo.thingsboardID)

    res.status(200).json({
      success: true,
      message: 'Dispositivo eliminado correctamente'
    })
  } catch (error) {
    next(error)
  }
}
