import con from "../database/db_connection.js";
import moment from "moment";

let now = moment();

export default {
  insert(data) {
    let sql = `INSERT INTO lichess_games (
            id,
            rated,
            variant,
            speed,
            status,
            white_name,
            white_title,
            white_rating,
            black_name,
            black_title,
            black_rating,
            winner,
            moves,
            clock_initial,
            clock_increment,
            clock_total,
            created_at,
            finished_at)

            VALUES (
            "${data.id}",
            "${data.rated}",
            "${data.variant}",
            "${data.speed}",
            "${data.status}",
            "${data.players.white.user.name}",
            "${data.players.white.user.title}",
            "${data.players.white.rating}",
            "${data.players.black.user.name}",
            "${data.players.black.user.title}",
            "${data.players.black.rating}",
            "${data.winner ?? "draw"}",
            "${data.moves}",
            "${data.clock.initial}",
            "${data.clock.increment}",
            "${data.clock.totalTime}",
            "${moment(data.created_at).format("YYYY-MM-DD hh:mm:ss")}",
            "${moment(data.finished_at).format("YYYY-MM-DD hh:mm:ss")}")`;

    con.query(sql, function (err, result) {
      if (err) throw err;

      console.log("1 record inserted");
    });
  },

  allFen(fen) {
    return new Promise((resolve, reject) =>
      con.query(
        `
                SELECT lichess_games.*, lichess_game_fens.move_id AS fen_move_id
                FROM lichess_games 
                JOIN lichess_game_fens 
                ON lichess_games.id = lichess_game_fens.game_id 
                WHERE lichess_game_fens.fen LIKE ? 
                AND lichess_games.status != 'aborted' 
                LIMIT 10
            `,
        fen + "%",
        (err, results) => {
          if (err) reject(err);

          resolve(results);
        }
      )
    );
  },

  getNextMoveInfo(moveId, path) {
    return new Promise((resolve, reject) =>
      con.query(
        `
        SELECT winner,fen, lichess_game_fens.move, COUNT(lichess_game_fens.id) as count
FROM lichess_game_fens
INNER JOIN lichess_games 
ON lichess_games.id = lichess_game_fens.game_id
WHERE lichess_game_fens.move_id=${moveId} AND lichess_games.moves LIKE "${path}%"
GROUP BY move, winner 
ORDER BY count desc;`,
        (err, results) => {
          if (err) reject(err);

          resolve(results);
        }
      )
    );
  },

  //   getNextMoves(path, moveId) {
  //     return new Promise((resolve, reject) =>
  //       con.query(
  //         `
  //         SELECT COUNT(lichess_game_fens.game_id) as count, move, fen
  // FROM lichess_game_fens
  // INNER JOIN lichess_games
  // ON lichess_games.id = lichess_game_fens.game_id
  // WHERE move_id=3 AND moves like "e4 e5%"
  // GROUP BY move
  // ORDER BY count desc limit 10;`,
  //         (err, results) => {
  //           if (err) reject(err);

  //           resolve(results);
  //         }
  //       )
  //     );
  //   },
};
