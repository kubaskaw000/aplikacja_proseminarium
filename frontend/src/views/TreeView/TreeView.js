import { useEffect, useState } from "react";
import Board from "../../components/Board/Board";
import "./TreeView.css";

//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w
//SELECT * FROM lichess_games WHERE moves LIKE 'e4 e5 bc4%';

//SELECT COUNT(id), move FROM lichess_game_fens WHERE move_id=0 AND move!="" GROUP BY move ORDER BY COUNT(id) desc;
const TreeView = () => {
  const [data, setData] = useState([]);
  const [path, setPath] = useState([]);
  const [moveId, setMoveId] = useState(1);
  const [boardFen, setBoardFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  useEffect(() => {
    const getGamesByPath = async (path, moveId) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tree-moves?path=${encodeURIComponent(
            path.join(" ")
          )}&moveId=${moveId}`,
          { credentials: "include" }
        );
        const resJson = await response.json();

        //console.log(resJson.data);
        setData(resJson.data);
      } catch (err) {
        console.log(err);
      }
    };

    getGamesByPath(path, moveId);
  }, [path]);

  //console.log(data);

  return (
    <>
      <div className="moves">
        {data.map((move, i) => (
          <div
            key={i}
            className="move"
            onClick={() => {
              let newPath = [...path, move.move];
              setPath(newPath);
              setMoveId(moveId + 1);
              setBoardFen(move.fen);
              console.log(path, moveId);
            }}
          >
            <div className="move-value">{move.move}</div>
            <div className="move-count">{move.count}</div>
          </div>
        ))}
        <Board fen={boardFen} />;
      </div>
    </>
  );
};

export default TreeView;
