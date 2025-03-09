export class GameBrain {
    #board;

    constructor(gameMode = 'human-vs-human', startAs = 'X') { 
        
    // private
    this.#board = [[], [], [], [], []];

    this.gridStartX = 1;
    this.gridStartY = 1;
    
    this.currentPlayer = 'X';
    this.opponentPlayer = 'O';
    
    this.remainingPiecesX = 4;
    this.remainingPiecesO = 4;
    
    this.selectedAction = null;

    this.gameMode = gameMode;
    this.gameState = 'Stopped'
    this.startAs = startAs;

    this.playerX = 'Player';
    this.playerO = 'Player';
    }
    
    makeAMove(x,y){        
        if (this.#board[x][y] === undefined) {
            this.#board[x][y] = this.currentPlayer;
            this.currentPlayer === 'X' ? this.remainingPiecesX-- : this.remainingPiecesO--;
            this.switchPlayer();
        }
    }

    moveExistingPiece(oldX, oldY, newX, newY){
        if (this.#board[oldX][oldY] === this.currentPlayer && this.#board[newX][newY] === undefined){
            this.#board[oldX][oldY] = undefined;
            this.#board[newX][newY] = this.currentPlayer;
            this.switchPlayer();
        }
    }

    moveGrid(x, y) {
        const withinBounds = x >= 0 && x + 3 <= 5 && y >= 0 && y + 3 <= 5;
        const validMove = Math.abs(x - this.gridStartX) <= 1 && Math.abs(y - this.gridStartY) <= 1;
        
        if (withinBounds && validMove) {
            this.gridStartX = x;
            this.gridStartY = y;
            this.switchPlayer();
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.opponentPlayer = this.opponentPlayer === 'X' ? 'O' : 'X';
    }

    resetGame() {
        this.#board = [[], [], [], [], []];
        this.currentPlayer = 'X';
        this.gridStartX = 1;
        this.gridStartY = 1;
        this.remainingPiecesX = 4;
        this.remainingPiecesO = 4;
        this.gameState = 'Stopped'
        this.selectedAction = null;
    }
    
    checkWin() {
        return this.checkAllLines(this.#board, 3, 3);
    }

    checkDraw() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.#board[i][j] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    checkAllLines(board, width, height) {
        for (let i = 0; i < width; i++) {
            if (this.checkLine(board, this.gridStartX + i, this.gridStartY, 1, 0, height)) return board[this.gridStartX + i][this.gridStartY];
            if (this.checkLine(board, this.gridStartX, this.gridStartY + i, 0, 1, width)) return board[this.gridStartX][this.gridStartY + i];
        }

        if (this.checkLine(board, this.gridStartX, this.gridStartY, 1, 1, width)) return board[this.gridStartX][this.gridStartY];
        if (this.checkLine(board, this.gridStartX + width - 1, this.gridStartY, -1, 1, width)) return board[this.gridStartX + width - 1][this.gridStartY];

        return null;
    }

    checkLine(board, startX, startY, dx, dy, length) {
        let first = board[startX][startY];
        if (first == null) return false;

        for (let i = 1; i < length; i++) {
            if (board[startX + i * dx]?.[startY + i * dy] !== first) return false;
        }
        return true;
    }

    get board() {
        return this.#board;
    }
}
