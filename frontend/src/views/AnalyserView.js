import Board from "../components/Board/Board";
import "../components/App/App.css";
import Analyser from "../components/Analyser/Analyser";
import Chess from "chess.js";
import { useEffect, useState } from "react";
import { isFenValid } from ".././helpers";
import Navigation from "../components/Navigation/Navigation";

const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const defaultGame = {
  currentMoveIndex: -1,
  moves: [],
  title: "-- vs --",
};

const defaultGames = {
  list: [defaultGame],
  index: 0,
};

const getGamesInfo = async (fen) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/lichess-games?fen=${fen}`,
      { credentials: "include" }
    );
    const data = await response.json();

    return data;
  } catch (err) {}
};

const stripLichessGames = (games) => {
  const chess = new Chess();

  let processed = [];

  for (let game of games) {
    let sans = game.moves.split(" ");

    let moves = [];

    chess.reset();

    for (let san of sans) {
      const move = chess.move(san);
      moves.push({ ...move, fen: chess.fen() });
    }

    processed.push({
      moves,
      currentMoveIndex: -1,
      title: `${game.white_rating} vs ${game.black_rating} - ${game.white_name} vs ${game.black_name}`,
    });
  }

  return processed;
};

function AnalyserView() {
  const [inputFen, setInputFen] = useState(defaultFen);
  const [boardFen, setBoardFen] = useState(defaultFen);
  const [games, setGames] = useState(defaultGames);
  const [game, setGame] = useState(defaultGame);

  console.log(boardFen);

  console.log(game);

  const updateGameMove = (fen, moveIndex) => {
    setGame({ ...game, currentMoveIndex: moveIndex });
    setBoardFen(fen);
  };

  const handleGamesUpdate = (e) => {
    if (e.keyCode === 13) {
      let fen = e.target.value;

      if (isFenValid(fen) === false) {
        alert("Wrong FEN");
        setBoardFen(defaultFen);

        return;
      } else setBoardFen(e.target.value);

      try {
        getGamesInfo(
          e.target.value.split(" ")[0] + " " + e.target.value.split(" ")[1]
        )
          .then((data) => {
            let games = [defaultGame];

            if (data.data.length > 0) {
              games = stripLichessGames(data.data);
            }

            setGames({ list: games, index: 0 });
          })
          .catch((err) => console.log(err));
      } catch (err) {}
    }
    return;
  };

  useEffect(() => {
    setGame(games.list[games.index]);
    console.log(games);
  }, [games]);

  return (
    <>
      <Navigation />
      <div className="app">
        <div className="app__board">
          <Board fen={boardFen} lastMove={game.moves[game.currentMoveIndex]} />

          <div className="board__input">
            <span>FEN</span>
            <input
              className="board__input__fen"
              type="text"
              value={inputFen}
              onChange={(e) => setInputFen(e.target.value)}
              onKeyDown={handleGamesUpdate}
            ></input>
          </div>
        </div>

        <div className="chess_analyser">
          <select
            className="game__selector"
            onChange={(e) => setGames({ ...games, index: e.target.value })}
          >
            {games.list.map((game, i) => (
              <option key={`game-${i}`} value={i}>
                {game.title}
              </option>
            ))}
          </select>

          {console.log(game)}
          <Analyser
            moves={game.moves || []}
            currentMoveIndex={game.currentMoveIndex}
            updateGameMove={updateGameMove}
          />
        </div>
      </div>
    </>
  );
}

export default AnalyserView;
