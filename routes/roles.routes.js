const router = require('express').Router()
const roles = require('../controllers/roles.controller')

router.get('/', roles.getAll)

module.exports = router