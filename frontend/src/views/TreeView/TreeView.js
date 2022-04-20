import { useEffect, useState } from "react";
import "./TreeView.css";

//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w
//SELECT * FROM lichess_games WHERE moves LIKE 'e4 e5 bc4%';

const getGamesByPath = async (path, moveId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/tree-moves?path=${path}&moveId=${moveId}`,
      { credentials: "include" }
    );
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

//SELECT COUNT(id), move FROM lichess_game_fens WHERE move_id=0 AND move!="" GROUP BY move ORDER BY COUNT(id) desc;
const TreeView = () => {
  const [data, setData] = useState([]);
  const [path, setPath] = useState([]);

  useEffect(() => {
    async function fetchMoves() {
      try {
        let response = await fetch(
          "http://localhost:5000/api/tree-initial-moves",
          {
            credentials: "include",
          }
        );
        response = await response.json();
        if (response.success) {
          setData(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchMoves();
  }, []);

  return (
    <>
      <div className="moves">
        {data.map((move) => (
          <div
            className="move"
            onClick={() => {
              let newPath = [...path, move.move];
              setPath(newPath);
              getGamesByPath(newPath.join(" "));
            }}
          >
            <div className="move-value">{move.move}</div>
            <div className="move-count">{move.count}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TreeView;
