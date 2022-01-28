import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import WebSocket from 'ws'
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


function getGamesIds(games) {
    let ids = []


    for (let game of games) {
        ids.push(game.getAttribute('href').split('/')[1])
    }

    return ids
}

async function replaceGame(replaceId, excludeIds) {
    let exclude = new URLSearchParams()

    for (let id of excludeIds) {
        exclude.append('exclude', id)
    }

    const response = await fetch('https://lichess.org/games/bullet/replacement/' + replaceId + '?' + exclude.toString())
    const { id } = await response.json()

    return id
}

function prepareFensData(data) {


    let fen;
    let moves = data.moves.split(' ');
    let preparedFenData = [];

    const chess = new Chess()

    for (let [move_id, move] of moves.entries()) {

        fen = chess.fen()

        fen = fen.split(' ')[0] + " " + fen.split(' ')[1]

        chess.move(move)

        preparedFenData.push({
            "id": data.id,
            "fen": fen,
            "move": move,
            "move_id": move_id
        })
    }

    //console.log(preparedFenData)

    return preparedFenData;
}


async function saveGameExport(gameId) {
    const response = await fetch('https://lichess.org/game/export/' + gameId, {
        headers: {
            'Accept': 'application/json'
        }
    })

    const data = await response.json()

    //console.log(data)

    let preparedFensData = prepareFensData(data)
    //console.log(preparedFensData);

    for (let [index, fen] of preparedFensData.entries()) {
        fens.insert(preparedFensData[index])
    }

    //
    games.insert(data); // model games.js / insert data


}

(async function () {
    //fenCheck()

    const response = await fetch('https://lichess.org/games/bullet')
    const page = await response.text()

    const { document } = new JSDOM(page).window
    const ids = getGamesIds(document.querySelectorAll('.mini-game'))

    const ws = new WebSocket(`wss://socket2.lichess.org/socket/v5?sri=${Math.random().toString(36).slice(2, 12)}`)

    ws.on('open', () => {
        ws.send('null')

        ws.send(JSON.stringify({
            t: 'startWatching',
            d: ids.join(' ')
        }))
    })

    ws.on('message', (message) => {
        if (message == '0') {
            setTimeout(() => ws.send('null'), 3000)
            return
        }

        let data = JSON.parse(message)

        if (data.t == 'finish') {

            const replaceId = data.d.id
            replaceGame(replaceId, ids).then(newGameId => {

                ids.push(newGameId)
                ws.send(JSON.stringify({
                    t: "startWatching",
                    d: newGameId
                }))
            }


            )

            //ids.push(newGameId)

            ids.splice(ids.indexOf(replaceId), 1)



            saveGameExport(replaceId)
        }
    })

})()
