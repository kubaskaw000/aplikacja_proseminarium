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
  const [moveRatio, setMoveRatio] = useState({
    ratio: {
      white: 0,
      draw: 0,
      black: 0,
    },
    count: 0,
  });

  const { mouseDownHandler, wheelHandler, transform } = useViewBox();

  console.log(moveRatio);

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

  const moveRatioPercentage = (moveRatio, count, fix = 2) => {
    return ((moveRatio / count) * 100).toFixed(fix);
  };

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
                      setMoveRatio(move);

                      console.log(move.count);
                      console.log(moveRatio);

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
        <div className="moveRatio">
          <div
            style={{
              width:
                moveRatioPercentage(moveRatio.ratio.white, moveRatio.count) +
                "%",
            }}
            class="board__white"
          >
            {moveRatioPercentage(moveRatio.ratio.white, moveRatio.count)}%
          </div>
          <div
            style={{
              width:
                moveRatioPercentage(moveRatio.ratio.draw, moveRatio.count) +
                "%",
            }}
            class="board__draw"
          >
            {moveRatioPercentage(moveRatio.ratio.draw, moveRatio.count)}%
          </div>
          <div
            style={{
              width:
                moveRatioPercentage(moveRatio.ratio.black, moveRatio.count) +
                "%",
            }}
            class="board__black"
          >
            {moveRatioPercentage(moveRatio.ratio.black, moveRatio.count)}%
          </div>
        </div>
      </div>
    </>
  );
};

export default TreeView;
