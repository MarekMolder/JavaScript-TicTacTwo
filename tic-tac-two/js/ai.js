export class Ai {
    
    AiMove(game) {
        let winningMove = this.findWinningMove(game);

        if (winningMove !== null) {
            console.log(winningMove);
            game.makeAMove(winningMove.value.x, winningMove.value.y);
            return
        }
        
        let blockingMove = this.findBlockingMove(game);
        
        if (blockingMove !== null) {
            game.makeAMove(blockingMove.value.x, blockingMove.value.y);
            return
        }
        
        this.getRandomMoveWithinGrid(game);
    }
    
    findBlockingMove(game) {
        for (let x = game.gridStartX; x < game.gridStartX + 3; x++) {
            for (let y = game.gridStartY; y < game.gridStartY + 3; y++) {
                if (game.board[x][y] === undefined) {
                    game.board[x][y] = game.opponentPlayer;
                    
                    if (game.checkWin() === game.opponentPlayer) {
                        game.board[x][y] = undefined;
                        return {value: {x, y}};
                    }
                    
                    game.board[x][y] = undefined;
                }
            }
        }
        return null;
    }

    findWinningMove(game) {
        for (let x = game.gridStartX; x < game.gridStartX + 3; x++) {
            for (let y = game.gridStartY; y < game.gridStartY + 3; y++) {
                if (game.board[x][y] === undefined) {
                    game.board[x][y] = game.currentPlayer;

                    if (game.checkWin() === game.currentPlayer) {
                        game.board[x][y] = undefined;
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