import { useEffect, useState } from "react";
import Board from "../../components/Board/Board";
import "./TreeView.css";

//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w
//SELECT * FROM lichess_games WHERE moves LIKE 'e4 e5 bc4%';

//SELECT COUNT(id), move FROM lichess_game_fens WHERE move_id=0 AND move!="" GROUP BY move ORDER BY COUNT(id) desc;
const TreeView = () => {
  const [data, setData] = useState([]);
  const [path, setPath] = useState([]);
  const [branches, setBranches] = useState([]);
  const [moveId, setMoveId] = useState(1);
  const [boardFen, setBoardFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  useEffect(() => {
    console.log(branches);
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
        //console.log(branches);
        //console.log(data);

        let branch = resJson.data;

        setBranches([...branches, branch]);

        console.log(branches);
      } catch (err) {
        console.log(err);
      }
    };

    getGamesByPath(path, moveId);
  }, [path]);

  //console.log(branches[0]);

  return (
    <>
      <div className="branches">
        {branches.map((branch, branchId) => (
          <div key={branchId} className="branch">
            <div className="moves">
              {branch.map((move, i) => (
                <div
                  key={i}
                  className="move"
                  onClick={() => {
                    let newPath = [...path, move.move];

                    setMoveId(branchId + 2);
                    setPath(newPath);
                    setBoardFen(move.fen);

                    if (moveId - branchId != 1) {
                      let newPath2 = newPath.splice(0, branchId);

                      setPath([...newPath2, move.move]);
                      setMoveId(newPath2.length + 2);
                      let newBranches = [...branches].slice(0, branchId + 1);
                      setBranches(newBranches);

                      console.log(moveId, branchId);
                      console.log(newPath2);
                    }

                    //console.log(path);
                    //console.log(path, moveId);
                  }}
                >
                  <div className="move-value">{move.move}</div>
                  <div className="move-count">{move.count}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Board fen={boardFen} />;
    </>
  );
};

export default TreeView;
