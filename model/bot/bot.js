const { getBoard, getAllAttackedByMe, simulateMov, getAllAttackedByEnemy, getAttacked } = require("../../utils/Chess")

const values = { p: 1, n: 3, b: 3.1, r: 5, q: 9, k: 4 }

const getPieceScore = piece => {
    return piece ? values[piece[1]] : 0
}

const getScore = (board, src, dest, myColor) => {
    const piece = board.inGameTiles[src[1]][src[0]]
    const newTiles = simulateMov(board.inGameTiles, src[0], src[1], dest[0], dest[1])
    const destPiece = board.inGameTiles[dest[1]][dest[0]]

    let mind = ""
    let score = 0
    const me = getAllAttackedByMe(newTiles, [piece, ...board.touched], myColor)
    me.forEach(s => {
        const sc = getPieceScore(newTiles[s[1]][s[0]])
        if (sc > 0) {
            score += sc
            mind += `+${sc} I can attack ${newTiles[s[1]][s[0]]}. `
        }
    })
    const en = getAllAttackedByEnemy(newTiles, [piece, ...board.touched], myColor)
    en.forEach(s => {
        const sc = getPieceScore(newTiles[s[1]][s[0]])
        if (sc > 0) {
            score -= sc * 3
            mind += `-${sc} I can loose ${newTiles[s[1]][s[0]]}. `
        }
    })

    if (destPiece) {
        const sc = getPieceScore(destPiece) * 2
        score += sc
        mind += `-${sc} I can capture ${destPiece}. `
    }
    return { score, mind }
}

const generateBotMove = game => {
    if (!game.result) {
        const board = getBoard(game.movs, game.movs.length)
        const touched = board.touched
        const tiles = board.inGameTiles
        const myColor = game.movs.length % 2 === 0 ? "w" : "b"

        const moves = []
        tiles.forEach((r, i) => r.forEach((c, j) => {
            if (c && c.slice(0, 1) === myColor) {
                const att = getAttacked(tiles, touched, myColor, j, i)
                if (att.length > 0) {
                    att.forEach(a => {
                        const score = getScore(board, [j, i], a, myColor)
                        moves.push({ src: [j, i], dest: a, ...score })
                    })
                }
            }
        }))

        const max = moves.reduce((max, m) => Math.max(m.score, max), Number.NEGATIVE_INFINITY)
        const cand = moves.filter(m => m.score === max)
        const mov = cand[Math.floor(Math.random() * cand.length)]
        //TODO, try to choose the best move among the ones with the same score instead of random
        console.log(":::::::::::::::::::::::::::::::");
        const smoves = moves.sort((a, b) => b.score - a.score)
        smoves.forEach(m => console.log(m))
        return { userId: myColor === "w" ? game.whiteId : game.blackId, ...mov }
    }
}

module.exports = { generateBotMove }