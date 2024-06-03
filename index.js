const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const corsOptions =  {
    origin: ['http://localhost:3001', 'http://localhost:8080'],
    methods: 'GET,POST,PUT,DELETE'
}
app.use(cors(corsOptions))

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/api/categorias', require('./routes/categorias.routes'))
app.use('/api/peliculas', require('./routes/peliculas.routes'))
app.use('*', (req, res) => {res.status(404).send()})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Aplicación de ejemplo escuchando en el puerto ${process.env.SERVER_PORT}`)
})