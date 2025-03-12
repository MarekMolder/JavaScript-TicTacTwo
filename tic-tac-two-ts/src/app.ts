import { UI } from './ui';
import { GameBrain } from './game';
import { Timer } from './timer';
import { Ai } from './ai';

export class GameController {
    private ui: UI;
    private ai: Ai;
    private game: GameBrain;
    private timer: Timer;

    constructor() {
        this.ui = new UI();
        this.ai = new Ai();
        this.timer = new Timer();
        this.game = new GameBrain();
        this.ui.createMenu(this.handleGameModeSelection.bind(this));
    }
    
    private handleGameModeSelection(mode: string): void {
        this.game.gameMode = mode;
        this.ui.showMarkerSelection(this.handleMarkerSelection.bind(this));
    }
    
    private handleMarkerSelection(marker: string): void {
        this.game.startAs = marker;
        this.startGame();
    }

    private startGame(): void {
        this.ui.hideMenu();



        this.assignPlayers(this.game);

        this.ui.generateGame(this.handleMove.bind(this), this.game, this.timer,
            this.handleDragStart.bind(this), this.handleDragOver.bind(this),  this.handleDrop.bind(this));
    }
    
    
    private handleMove(x: number, y: number, e: Event): void {

        if (this.game.gameState === 'Stopped') {
            return;
        }

        const isPlayerTurn = this.game.currentPlayer === 'O' && this.game.playerO === 'Player' ||
            this.game.currentPlayer === 'X' && this.game.playerX === 'Player';

        if (isPlayerTurn) {

            if (this.game.selectedAction === 'placeNew' && ((this.game.currentPlayer === 'O' && this.game.remainingPiecesO !== 0) || (this.game.currentPlayer === 'X' && this.game.remainingPiecesX !== 0))) {
                this.game.makeAMove(x, y);
            } else if (this.game.selectedAction === 'moveGrid') {
                this.game.moveGrid(x, y);
            }

        } else if ((this.game.currentPlayer === 'O' && this.game.playerO === 'AI') || (this.game.currentPlayer === 'X' && this.game.playerX === 'AI')) {
            this.handleAI(this.game);
        }

        this.ui.drawBoard(this.handleMove.bind(this), this.game, this.handleDragStart.bind(this),
            this.handleDragOver.bind(this), this.handleDrop.bind(this));
        
        (e.target as HTMLElement).innerHTML = this.game.board[x][y] || "&nbsp;";
        
        this.callOutDrawWin(this.game);
    }

    private handleDragStart(event: DragEvent, x: number, y: number): void {
        event.dataTransfer?.setData('text', `${x},${y}`);
    }

    private handleDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    private handleDrop(event: DragEvent, x: number, y: number): void {
        if (this.game.gameState === 'Stopped') {
            return;
        }

        if ((this.game.currentPlayer === 'O' && this.game.playerO === 'Player') || (this.game.currentPlayer === 'X' && this.game.playerX === 'Player')) {
            if (this.game.selectedAction === 'moveExisting') {
                event.preventDefault();

                let startX: number | undefined;
                let startY: number | undefined;

                const startCoordinates = event.dataTransfer?.getData('text').split(',');
                if (startCoordinates) {
                    startX = parseInt(startCoordinates[0], 10);
                }
                if (startCoordinates) {
                    startY = parseInt(startCoordinates[1], 10);
                }

                if (startX !== undefined && startY !== undefined) {
                    this.game.moveExistingPiece(startX, startY, x, y);

                    this.ui.drawBoard(
                        this.handleMove.bind(this),
                        this.game,
                        this.handleDragStart.bind(this),
                        this.handleDragOver.bind(this),
                        this.handleDrop.bind(this)
                    );

                    this.callOutDrawWin(this.game);
                }
            }
        }
    }

    private handleAI(game: GameBrain): void {
        if (game.playerX === 'AI' && game.currentPlayer === 'X' && game.remainingPiecesX === 0 || this.game.playerO === 'AI' && this.game.currentPlayer === 'O' && this.game.remainingPiecesO === 0) {
            game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
            game.opponentPlayer = game.opponentPlayer === 'X' ? 'O' : 'X';
            return;
        }

        if ((game.playerX === 'AI' && game.currentPlayer === 'X' && game.remainingPiecesX !== 0) || (this.game.playerO === 'AI' && this.game.currentPlayer === 'O' && this.game.remainingPiecesO !== 0)) {
            this.ai.AiMove(game)
        }
    }

    private assignPlayers(game: GameBrain): void {
        if (this.game.gameMode === 'ai-vs-human') {
            game.startAs === 'X' ? game.playerO = 'AI' : game.playerX = 'AI';
        } else if (this.game.gameMode === 'ai-vs-ai') {
            game.playerX = game.playerO = 'AI';
        }
    }

    private callOutDrawWin(game: GameBrain): void {
        if (game.checkDraw()) {
            game.gameState = 'Stopped';
            this.callOutDraw();
        } else if (game.checkWin() === 'X' || game.checkWin() === 'O') {
            this.callOutWinner();
        }
    }

    private callOutWinner(): void {
        let winner = this.game.checkWin();
        if (winner) {
            let winnerElement = document.createElement('div');
            winnerElement.classList.add('winner');
            winnerElement.innerHTML = `Player ${winner} wins!`;
            this.ui.gameDiv.appendChild(winnerElement);

            this.timer.toggleTimer(this.game);

            let timerButton = document.querySelector('.timer-button');
            timerButton?.remove();

        }
    }

    private callOutDraw(): void {
        let draw = this.game.checkDraw();
        if (draw) {
            let drawElement = document.createElement('div');
            drawElement.classList.add('draw');
            drawElement.innerHTML = `Its a draw!`;
            this.ui.gameDiv.appendChild(drawElement);

            this.timer.stopTimer();
        }
    }
}
