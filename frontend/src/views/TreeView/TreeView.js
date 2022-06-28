import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation/Navigation.js";
import Board from "../../components/Board/Board";
import useViewBox from "../../hooks/useViewBox.js";
import "./TreeView.css";

const TreeView = () => {
  const [path, setPath] = useState([]);
  const [branches, setBranches] = useState([]);
  const [moveId, setMoveId] = useState(1);
  const [boardFen, setBoardFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const { mouseDownHandler, touchStartHandler, wheelHandler, transform } =
    useViewBox();

  const sumMovesCount = (arr) =>
    arr.reduce((previousValue, el) => previousValue + el.count, 0);

  useEffect(() => {
    //console.log(branches);
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
        //console.log(branches);
        //console.log(data);

        let branch = resJson.data;

        setBranches([...branches, branch]);

        //console.log(branches);
      } catch (err) {
        console.log(err);
      }
    };

    getGamesByPath(path, moveId);
  }, [path]);

  //console.log(branches[0]);

  return (
    <>
      <Navigation />

      <div
        style={transform()}
        onMouseDown={mouseDownHandler}
        onWheel={wheelHandler}
        className="app-tree"
      >
        <div className="branches">
          {branches.map((branch, branchId) => (
            <div key={branchId} className="branch">
              <div className="moves">
                {branch.map((move, i) => (
                  <div
                    key={i}
                    className="move"
                    onClick={(e) => {
                      e.currentTarget.classList.toggle("selected");
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
                      }
                    }}
                  >
                    <div className="move-value">{move.move}</div>
                    <div className="move-percentage">
                      {((move.count / sumMovesCount(branch)) * 100).toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="tree-board">
        <Board fen={boardFen} />
      </div>
    </>
  );
};

export default TreeView;
