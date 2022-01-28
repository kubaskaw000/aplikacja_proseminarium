import Chess from 'chess.js'
import React from 'react'
import classNames from 'classnames'
import './Board.css'

const coordsX = ["1", "2", "3", "4", "5", "6", "7", "8"]
const coordsY = ["a", "b", "c", "d", "e", "f", "g", "h"]

function getPiecesInfo(currentBoard) {

    let pieces = [];
    for (let j = 0; j < coordsY.length; j++) {
        for (let i = 0; i < coordsX.length; i++) {

            if (currentBoard[j][i] !== null) {
                pieces.push({
                    "type": currentBoard[j][i].type,
                    "color": currentBoard[j][i].color,
                    "id": coordsY[i] + coordsX[j],
                    "imgSrc": `/img/${currentBoard[j][i].color + currentBoard[j][i].type}.svg`,
                })
            }
            else {
                pieces.push({
                    "id": coordsY[i] + coordsX[j],
                    "imgSrc": ``,
                })
            }

        }
    }
    return pieces;

}

function fieldClass(isWhite, isFrom, isTo, isCheck) {
    return classNames({
        "tile": true,
        "board__white__tile": isWhite,
        "board__black__tile": !isWhite,
        "moved_from": isFrom,
        "moved_to": isTo,
        "check": isCheck
    });

}

const Board = ({ fen, lastMove }) => {


    const chess = new Chess(fen)

    const inCheck = chess.in_check()

    let currentPositionOnBoard = [];
    currentPositionOnBoard = chess.board();

    let board = [];
    let piecesInfo = []
    let fieldNr = 0;

    piecesInfo = getPiecesInfo(currentPositionOnBoard);

    console.log(currentPositionOnBoard)



    for (let j = coordsY.length - 1; j >= 0; j--) {
        for (let i = 0; i < coordsX.length; i++) {

            let x = j + i + 1;

            let id = coordsY[i] + coordsX[j];

            board.push(
                <>
                    <div id={id} className={fieldClass(x % 2 === 0,
                        id === lastMove?.from, id === lastMove?.to,
                        inCheck && piecesInfo[fieldNr]?.type == 'k' && piecesInfo[fieldNr]?.color == chess.turn())}>
                        {piecesInfo[fieldNr].imgSrc && <img className="piece" src={piecesInfo[fieldNr].imgSrc} />}
                    </div>
                </>
            )
            fieldNr++;
        }
    }

    return (
        <>
            <div className="board">{board}
            </div>
        </>
    )
}


export default Board;