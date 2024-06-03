const { rol } = require('../models')

let self = {}

self.getAll = async function(req, res, next) {
    let data = await rol.findAll({ attributes: ['id', 'nombre'] })
    return res.status(200).json(data)
}

module.exports = self