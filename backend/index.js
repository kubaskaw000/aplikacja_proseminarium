import fetch from 'node-fetch'
import games from './models/games.js'
import { Chess } from 'chess.js'
import fens from './models/fens.js'
import express from 'express'
import cors from 'cors'

import x from './x.js'

const port = 5000;

const app = express()

app.use(cors())

app.get('/api/lichess-games', async (req, res) => {
    let fen = req.query.fen

    fen = fen.split(' ')[0] + " " + fen.split(' ')[1]

    const response = {}

    if (fen) {
        response.success = true
        response.data = await games.allFen(fen)
    }
    else {
        response.success = false
        response.error_message = 'fen parameter is required'
    }

    res.set('Content-Type', 'application/json')

    res.send(JSON.stringify(response))
})



app.listen(port, () => 'Listening on port' + port)



