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

    checkWin(): string | null {
        return this.checkAllLines(this.board, this.gridStartX, this.gridStartY) ?? null;
    }

    checkAllLines(board: (string | undefined)[][], startX: number, startY: number): string | null {
        const width = 3;
        const height = 3;

        for (let i = 0; i < width; i++) {
            let winner = this.checkLine(board, startX + i, startY, 0, 1, height);
            if (winner) return winner;

            winner = this.checkLine(board, startX, startY + i, 1, 0, width);
            if (winner) return winner;
        }

        for (let i = 0; i < width; i++) {
            let diagWinner1 = this.checkLine(board, startX + i, startY, 1, 1, Math.min(width - i, height));
            if (diagWinner1) return diagWinner1;

            let diagWinner2 = this.checkLine(board, startX + i, startY + height - 1, 1, -1, Math.min(width - i, height));
            if (diagWinner2) return diagWinner2;
        }

        for (let j = 0; j < height; j++) {
            let diagWinner1 = this.checkLine(board, startX, startY + j, 1, 1, Math.min(width, height - j));
            if (diagWinner1) return diagWinner1;

            let diagWinner2 = this.checkLine(board, startX + width - 1, startY + j, -1, 1, Math.min(width, height - j));
            if (diagWinner2) return diagWinner2;
        }

        return null;
    }

    checkLine(board: (string | undefined)[][], startX: number, startY: number, deltaX: number, deltaY: number, length: number): string | null | undefined {
        let count = 0;
        let currentPiece: string | undefined = '';

        for (let i = 0; i < length; i++) {
            const x = startX + i * deltaX;
            const y = startY + i * deltaY;

            if (x < 0 || y < 0 || x >= board.length || y >= board[x].length) break;

            const piece = board[x][y];
            if (piece === currentPiece && piece !== '') {
                count++;
            } else {
                currentPiece = piece;
                count = piece !== '' ? 1 : 0;
            }

            if (count >= 3) {
                return currentPiece;
            }
        }

        return null;
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
}
