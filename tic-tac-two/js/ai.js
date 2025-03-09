export class Ai {
    
    AiMove(game) {
        let blockingMove = this.findBlockingMove(game);

        if (blockingMove) {
            game.makeAMove(blockingMove.value.x, blockingMove.value.y);
            return
        }
        
        let winningMove = this.findWinningMove(game);

        if (winningMove) {
            game.makeAMove(winningMove.value.x, winningMove.value.y);
            return
        }
        
        this.getRandomMoveWithinGrid(game);
    }
    
    findWinningMove(game) {
        return this.findBestMove(game, game.currentPlayer);
    }
    
    findBlockingMove(game) {
        return this.findBestMove(game, game.opponentPlayer);
    }

    findBestMove(game, player) {
        for (let x = game.gridStartX; x < game.gridStartX + 3; x++) {
            for (let y = game.gridStartY; y < game.gridStartY + 3; y++) {
                if (game.board[x][y] === undefined) {
                    game.board[x][y] = player;

                    if (game.checkWin() === player) {
                        game.board[x][y] = undefined;
                        console.log(x,y)
                        return {value: {x, y}};
                    }

                    game.board[x][y] = undefined;
                }
            }
        }
        return null;
    }
    
    getRandomMoveWithinGrid(game) {
        for (let x = game.gridStartX; x < game.gridStartX + 3; x++) {
            for (let y = game.gridStartY; y < game.gridStartY + 3; y++) {
                if (x < 5 && y < 5 && game.board[x][y] === undefined) {
                    game.makeAMove(x, y);
                    return
                }
            }
        }
        
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (game.board[x][y] === undefined) {
                    game.makeAMove(x, y);
                    return
                }
            }
        }
    }
}