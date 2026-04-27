const express = require('express')

const app = express()

const port = 3000

const cors = require('cors')

app.use(cors({origin: '*'}))

app.use(express.json())

const gameRouter = require('./routes/gameRoutes')

app.use('/api/games', gameRouter)

app.listen(port, () => console.log('Le serveur en écoute sur le port 3000 !'))