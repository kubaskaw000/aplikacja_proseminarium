import con from '../database/db_connection.js'

export default
    {
        insert(data) {
            //data.fen = .split(' ')
            let sql = `INSERT INTO lichess_game_fens (
            id,
            fen,
            move_id,
            game_id,
            move)

            VALUES (
            NULL,
            "${data.fen}",
            ${data.move_id},
            "${data.id}",
            "${data.move}")`

            con.query(sql, function (err, result) {
                if (err) throw err;

                // console.log("1 record inserted");
            });

        }

    }