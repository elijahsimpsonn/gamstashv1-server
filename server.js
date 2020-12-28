require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const consolesRouter = require('./routes/consoles-router')
const gamesRouter = require('./routes/games-router')
const helmet = require('helmet')
const knex = require('knex')
const { DATABASE_URL } = require('./db/config')

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
})

const app = express()
app.set('db', db)
app.use(morgan("dev"))
app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/api/v1/consoles', consolesRouter)
app.use('/api/v1/games', gamesRouter)

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is live on port ${port}`)
})

module.exports = app