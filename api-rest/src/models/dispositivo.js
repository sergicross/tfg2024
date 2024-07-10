const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
// Expresión regular para validar una dirección IP
const ipValida = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const dispositivoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, 'El nombre del dispositivo es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  ip: {
    type: String,
    unique: true,
    required: [true, 'La ip del dispositivo es obligatoria'],
    trim: true,
    validate: {
      validator: function (v) {
        return ipValida.test(v)
      },
      message: props => `${props.value} no es una dirección IP válida`
    }
  },
  puerto: {
    type: Number,
    required: [true, 'El puerto del dispositivo es obligatorio'],
    min: [1, 'El puerto debe ser un número positivo'],
    max: [65535, 'El puerto no puede ser mayor a 65535']
  },
  thingsboardID: {
    type: String,
    required: [true, 'El ID de Thingsboard es obligatorio'],
    unique: true,
    trim: true
  },
  accessTokenThingsboard: {
    type: String,
    required: [true, 'El token de acceso de Thingsboard es obligatorio'],
    unique: true,
    trim: true
  },
  registros: [{
    nombreRegistro: {
      type: String,
      required: [true, 'El nombre de registro es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre de registro debe tener al menos 3 caracteres']
    },
    direccionMemoria: {
      type: Number,
      required: [true, 'La dirección de memoria del registro es obligatoria'],
      min: [0, 'La dirección de memoria no puede ser negativa']
    },
    bytesLeer: {
      type: Number,
      required: [true, 'El número de bytes a leer es obligatorio'],
      min: [1, 'El número de bytes a leer debe ser al menos 1']
    },
    unidades: {
      type: String,
      required: [true, 'La dirección de memoria del registro donde se encuentran las unidades es obligatoria'],
      trim: true
    }
  }]
})

dispositivoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único. {VALUE} ya está registrado.' })
module.exports = mongoose.model('Dispositivo', dispositivoSchema)
