const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const ClaimTypes = require('../config/claimtypes')
const { GeneraToken } = require('../services/jwttoken.service')

const Authorize = (rol) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.header('Authorization')
            if(!authHeader.startsWith('Bearer ')) {
                return null
            }

            const token = authHeader.split(' ')[1]
            const decodedToken = jwt.verify(token, jwtSecret)

            if(rol.split(',').indexOf(decodedToken[ClaimTypes.Role] ) == -1) {
                return res.status(401).send()
            }

            req.decodedToken = decodedToken

            const minutosRestantes = (decodedToken.exp - (new Date().getTime() / 1000)) / 60
            if(minutosRestantes < 5) {
                const nuevoToken = GeneraToken(
                    decodedToken[ClaimTypes.Name],
                    decodedToken[ClaimTypes.GivenName],
                    decodedToken[ClaimTypes.Role]
                )
            }

            next()
        } catch (error) {
            return res.status(401).send()
        }
    }
}

module.exports = Authorize