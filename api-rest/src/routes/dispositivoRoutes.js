const express = require('express')
const router = express.Router()
const dispositivoController = require('../controllers/dispositivoController')

router.post('/dispositivos', dispositivoController.crearDispositivo)
router.get('/dispositivos', dispositivoController.obtenerTodosDispositivos)
router.get('/dispositivos/:id', dispositivoController.obtenerDispositivoID)
router.get('/dispositivos/nombre/:nombre', dispositivoController.obtenerDispositivoNombre)
router.get('/dispositivos/ip/:ip', dispositivoController.obtenerDispositivoIP)
router.patch('/dispositivos/:id', dispositivoController.actualizarDispositivo)
router.delete('/dispositivos/:id', dispositivoController.borrarDispositivo)

module.exports = router
