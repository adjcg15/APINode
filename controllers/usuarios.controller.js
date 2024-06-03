const { usuario, rol, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

let self = {}

self.getAll = async function(req, res) {
    const data = await usuario.findAll({
        raw: true,
        attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
        include: { model: rol, attributes: [] }
    })

    return res.status(200).json(data)
}

self.get = async function(req, res) {
    const email = req.params.email
    const data = await usuario.findOne({
        where: { email },
        raw: true,
        attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
        include: { model: rol, attributes: [] }
    })

    if(data) {
        return res.status(200).json(data)
    }

    return res.status(404).send()
}

self.create = async function(req, res) {
    try {
        const rolusuario = await rol.findOne({ where: { nombre: req.body.rol }})
        const data = await usuario.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolusuario.id
        })

        return res.status(201).json({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            rolid: rolusuario.nombre
        })
    } catch (error) {
        console.log(error)
    }
}

self.update = async function(req, res) {
    const email = req.params.email
    const rolusuario = await rol.findOne({ where: {nombre: req.body.rol} })
    req.body.rolid = rolusuario.id

    const data = await usuario.update(req.body, {
        where: {email}
    })

    if(data[0] === 0) {
        return res.status(404).send()
    } else {
        return res.status(204).send()
    }
}

self.delete = async function(req, res) {
    const email = req.params.email
    let data = await usuario.findOne({ where: {email} })

    if(data.protegido) {
        return res.status(403).send()
    }

    data = await usuario.destroy({ where: { email } })
    if(data === 1) {
        return res.status(204).send()
    }

    return res.status(400).send()
}

module.exports = self