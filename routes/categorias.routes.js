const router = require('express').Router()
const categorias = require('../controllers/categorias.controller')
const Authorize = require('../middlewares/auth.middleware')

router.get('/', Authorize('Administrador'), categorias.getAll)

router.get('/:id', Authorize('Administrador'), categorias.get)

router.post('/', Authorize('Administrador'), categorias.create)

router.put('/:id', Authorize('Administrador'), categorias.update)

router.delete('/:id', Authorize('Administrador'), categorias.delete)

module.exports = router