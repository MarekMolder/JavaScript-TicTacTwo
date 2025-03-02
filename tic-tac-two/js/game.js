export class GameBrain {
    #board;

    constructor() { 
    // private
    this.#board = [[], [], [], [], []];

    this.gridStartX = 1;
    this.gridStartY = 1;
    
    this.currentPlayer = 'X';
    this.remainingPiecesX = 4;
    this.remainingPiecesO = 4;

    this.gameType = 'PvP';
    this.gameState = 'Stopped'

    this.playerX = 'Player';
    this.playerO = 'Player';
    }

    makeAMove(x,y){        
        if (this.#board[x][y] === undefined) {
            this.#board[x][y] = this.currentPlayer;
            if (this.currentPlayer === 'X') {
                this.remainingPiecesX--;
            } else {
                this.remainingPiecesO--;
            }
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    moveExistingPiece(oldX, oldY, newX, newY){
        if (this.#board[oldX][oldY] === this.currentPlayer && this.#board[newX][newY] === undefined){
            this.#board[oldX][oldY] = null;
            this.#board[newX][newY] = this.currentPlayer;
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    moveGrid(x, y) { 
        if ((x >= 0 && x + 3 <= 5 && y >= 0 && y + 3 <= 5) && Math.abs(x - this.gridStartX) <= 1 && Math.abs(y - this.gridStartY) <= 1) {
            this.gridStartX = x;
            this.gridStartY = y;
        }
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    resetGame() {
        this.#board = [[], [], [], [], []];
        this.currentPlayer = 'X';
        this.gridStartX = 1;
        this.gridStartY = 1;
        this.remainingPiecesX = 4;
        this.remainingPiecesO = 4;
        this.gameState = 'Stopped'
    }
    

    checkWin() {
        return this.CheckAllLines(this.#board, 3, 3);
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
            if (this.CheckLine(board, this.gridStartX + i, this.gridStartY, 1, 0, height)) return board[this.gridStartX + i][this.gridStartY];
            if (this.CheckLine(board, this.gridStartX, this.gridStartY + i, 0, 1, width)) return board[this.gridStartX][this.gridStartY + i];
        }

        if (this.CheckLine(board, this.gridStartX, this.gridStartY, 1, 1, width)) return board[this.gridStartX][this.gridStartY];
        if (this.CheckLine(board, this.gridStartX + width - 1, this.gridStartY, -1, 1, width)) return board[this.gridStartX + width - 1][this.gridStartY];

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