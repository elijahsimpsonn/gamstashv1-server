require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const consolesRouter = require('./routes/consoles-router')
// const gamesRouter = require('./routes/games-router')

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

app.use('/api/v1/consoles', consolesRouter)
// app.use('/api/v1/games', gamesRouter)

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is live on port ${port}`)
})