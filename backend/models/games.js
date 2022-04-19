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
            "${data.winner}",
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

  initialMoves() {
    return new Promise((resolve, reject) =>
      con.query(
        `
            SELECT COUNT(id) as count, move 
            FROM lichess_game_fens WHERE move_id=0 AND move!=""
            GROUP BY move 
            ORDER BY COUNT(id) desc
            limit 10`,
        (err, results) => {
          if (err) reject(err);

          resolve(results);
        }
      )
    );
  },

  findByMoves(path) {
    return new Promise((resolve, reject) =>
      con.query(
        `
        SELECT * FROM lichess_games WHERE moves LIKE '${path}%' limit 10`,
        (err, results) => {
          if (err) reject(err);

          resolve(results);
        }
      )
    );
  },
};
