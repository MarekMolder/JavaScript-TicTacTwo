export class GameBrain {
    public board: (string | undefined)[][];
    public gridStartX: number;
    public gridStartY: number;
    public currentPlayer: string;
    public opponentPlayer: string;
    public remainingPiecesX: number;
    public remainingPiecesO: number;
    public selectedAction: string | null;
    public gameMode: string;
    public gameState: string;
    public startAs: string;
    public playerX: string;
    public playerO: string;

    constructor(gameMode: string = 'human-vs-human', startAs: string = 'X') {

        // private
        this.board = [[], [], [], [], []];

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

    makeAMove(x: number, y: number): void{
        if (this.board[x][y] === undefined) {
            this.board[x][y] = this.currentPlayer;
            this.currentPlayer === 'X' ? this.remainingPiecesX-- : this.remainingPiecesO--;
            this.switchPlayer();
        }
    }

    moveExistingPiece(oldX: number, oldY: number, newX: number, newY: number): void{
        if (this.board[oldX][oldY] === this.currentPlayer && this.board[newX][newY] === undefined){
            this.board[oldX][oldY] = undefined;
            this.board[newX][newY] = this.currentPlayer;
            this.switchPlayer();
        }
    }

    moveGrid(x: number, y: number): void {
        const withinBounds = x >= 0 && x + 3 <= 5 && y >= 0 && y + 3 <= 5;
        const validMove = Math.abs(x - this.gridStartX) <= 1 && Math.abs(y - this.gridStartY) <= 1;

        if (withinBounds && validMove) {
            this.gridStartX = x;
            this.gridStartY = y;
            this.switchPlayer();
        }
    }

    switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.opponentPlayer = this.opponentPlayer === 'X' ? 'O' : 'X';
    }

    resetGame(): void {
        this.board = [[], [], [], [], []];
        this.currentPlayer = 'X';
        this.gridStartX = 1;
        this.gridStartY = 1;
        this.remainingPiecesX = 4;
        this.remainingPiecesO = 4;
        this.gameState = 'Stopped'
        this.selectedAction = null;
    }

    checkWin(): string | null | undefined {
        return this.checkAllLines(this.board, 3, 3);
    }

    checkDraw(): boolean {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.board[i][j] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    checkAllLines(board: (string | undefined)[][], width: number, height: number): string | null | undefined {
        for (let i = 0; i < width; i++) {
            if (this.checkLine(board, this.gridStartX + i, this.gridStartY, 1, 0, height)) return board[this.gridStartX + i][this.gridStartY];
            if (this.checkLine(board, this.gridStartX, this.gridStartY + i, 0, 1, width)) return board[this.gridStartX][this.gridStartY + i];
        }

        if (this.checkLine(board, this.gridStartX, this.gridStartY, 1, 1, width)) return board[this.gridStartX][this.gridStartY];
        if (this.checkLine(board, this.gridStartX + width - 1, this.gridStartY, -1, 1, width)) return board[this.gridStartX + width - 1][this.gridStartY];

        return null;
    }

    checkLine(board: (string | undefined)[][], startX: number, startY: number, dx: number, dy: number, length: number): boolean {
        let first = board[startX][startY];
        if (first == null) return false;

        for (let i = 1; i < length; i++) {
            if (board[startX + i * dx]?.[startY + i * dy] !== first) return false;
        }
        return true;
    }
}
