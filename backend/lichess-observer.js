import WebSocket from "ws";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import fens from "./models/fens.js";
import games from "./models/games.js";
import { Chess } from "chess.js";

class LichessObserver {
  constructor(gameType) {
    this.games = [];
    this.gameType = gameType;
    this.pingTimeout = 3000;
    this.excludeId = {};
  }

  async replaceGame(replaceId, excludeIds) {
    let exclude = new URLSearchParams();

    for (let id of excludeIds) {
      exclude.append("exclude", id);
    }

    const response = await fetch(
      `https://lichess.org/games/${this.gameType}/replacement/` +
        replaceId +
        "?" +
        exclude.toString()
    );
    const { id } = await response.json();

    return id;
  }

  prepareFensData(data) {
    let fen;
    let moves = data.moves.split(" ");
    let preparedFenData = [];

    const chess = new Chess();

    preparedFenData.push({
      id: data.id,
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
      move: null,
      move_id: 0,
    });

    for (let [move_id, move] of moves.entries()) {
      chess.move(move);

      fen = chess.fen();
      fen = fen.split(" ")[0] + " " + fen.split(" ")[1];

      chess.move(move);

      preparedFenData.push({
        id: data.id,
        fen: fen,
        move: move,
        move_id: move_id + 1,
      });
    }
    return preparedFenData;
  }

  async saveGameExport(gameId) {
    const response = await fetch("https://lichess.org/game/export/" + gameId, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    //console.log(data)

    let preparedFensData = this.prepareFensData(data);
    //console.log(preparedFensData);

    for (let [index, fen] of preparedFensData.entries()) {
      fens.insert(preparedFensData[index]);
    }
    //
    games.insert(data); // model games.js / insert data
  }

  async initGames() {
    const response = await fetch(`https://lichess.org/games/${this.gameType}`);
    const page = await response.text();

    const { document } = new JSDOM(page).window;

    for (let element of document.querySelectorAll(".mini-game")) {
      this.games.push(element.getAttribute("href").split("/")[1]);
    }
  }

  initWs() {
    this.ws = new WebSocket(
      `wss://socket2.lichess.org/socket/v5?sri=${Math.random()
        .toString(36)
        .slice(2, 12)}`
    );

    this.ws.on("open", () => {
      this.ws.send("null");

      console.log("ping");

      this.ws.send(
        JSON.stringify({
          t: "startWatching",
          d: this.games.join(" "),
        })
      );
    });

    this.ws.on("message", async (message) => {
      //console.log("%s", message);
      if (message == "0") {
        setTimeout(() => this.ws.send("null"), this.pingTimeout);
        return;
      }

      let data = JSON.parse(message);

      if (data.t == "finish") {
        const replaceId = data.d.id;
        //console.log(replaceId);
        await this.replaceGame(replaceId, this.games).then((newGameId) => {
          this.games.push(newGameId);
          this.ws.send(
            JSON.stringify({
              t: "startWatching",
              d: newGameId,
            })
          );
        });

        this.games.splice(this.games.indexOf(replaceId), 1);

        //console.log(this.gameType, this.games);

        await this.saveGameExport(replaceId);
      }
    });
  }

  async start() {
    await this.initGames();

    //console.log(this.games);

    this.initWs();
  }
}

const gameTypes = ["bullet", "blitz", "rapid", "classical"];

for (let gameType of gameTypes) {
  const observer = new LichessObserver(gameType);

  observer.start();
}
