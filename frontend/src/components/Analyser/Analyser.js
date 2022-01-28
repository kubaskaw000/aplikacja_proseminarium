import './Analyser.css'

const Analyser = ({ moves, currentMoveIndex, updateGameMove }) => {



    // let gameIndex = moves.index
    let moves_grid = [];
    let moveIndex = 1;

    //console.log(moves.list[gameIndex].currentMoveIndex)

    if (moves.length > 0) {
        for (let i = 0; i < moves.length; i++) {

            if (i % 2 === 0) {
                moves_grid.push(
                    <>
                        <div className='move__index'>{moveIndex}</div>
                    </>
                )
                moveIndex++;
            }
            moves_grid.push(
                <>
                    <div className='analyser__move' onClick={() => updateGameMove(moves[i].fen, i)}>{moves[i].san}</div>
                </>
            )
        }
    }

    return (
        <>
            <div className="analyser">{moves_grid}
            </div>
        </>
    )
}

export default Analyser;