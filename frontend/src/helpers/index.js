import Chess from 'chess.js'

const isFenValid = (fen) => {

    const chess = new Chess()

    return chess.validate_fen(fen).valid
}

export {
    isFenValid
}