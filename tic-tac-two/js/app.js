import { UI } from './ui.js';
import { GameBrain } from './game.js';
import { Timer } from './timer.js';
import { Ai } from './ai.js';


let ui = new UI();
let ai = new Ai();
let game, timer, startAs, gameMode;

ui.createMenu(handleGameModeSelection, handleMarkerSelection);

function handleGameModeSelection(mode) {
    gameMode = mode;
    ui.showMarkerSelection(handleMarkerSelection);
}

function handleMarkerSelection(marker) {
    startAs = marker;
    startGame();
}

function startGame() {
    ui.hideMenu();
    
    timer = new Timer();
    game = new GameBrain(gameMode, startAs);
    
    assignPlayers(game);
    
    ui.generateGame(handleMove, game, timer, handleDragStart, handleDrop, handleDragOver);
}

function handleMove(x, y, e) {
    
    if (game.gameState === 'Stopped') {
        return;
    }

    const isPlayerTurn = game.currentPlayer === 'O' && game.playerO === 'Player' ||
        game.currentPlayer === 'X' && game.playerX === 'Player';
    
    if (isPlayerTurn) {
        
        if (game.selectedAction === 'placeNew' && ((game.currentPlayer === 'O' && game.remainingPiecesO !== 0) || (game.currentPlayer === 'X' && game.remainingPiecesX !== 0))) {
            game.makeAMove(x, y);
        } else if (game.selectedAction === 'moveGrid') {
            game.moveGrid(x, y);
        }
        
    } else if ((game.currentPlayer === 'O' && game.playerO === 'AI') || (game.currentPlayer === 'X' && game.playerX === 'AI')) {
        handleAI(game);
    }

    ui.drawBoard(handleMove, game, handleDragStart, handleDragOver, handleDrop);
    e.target.innerHTML = game.board[x][y] || "&nbsp;";
    callOutDrawWin(game);
}

function handleDragStart(event, x, y) {
    game.dragStartX = x;
    game.dragStartY = y;
    event.dataTransfer.setData('text', `${x},${y}`);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event, x, y) {
    if (game.gameState === 'Stopped') {
        return;
    }

    if ((game.currentPlayer === 'O' && game.playerO === 'Player') || (game.currentPlayer === 'X' && game.playerX === 'Player')) {
        if (game.selectedAction === 'moveExisting') {
            event.preventDefault();

            const startCoordinates = event.dataTransfer.getData('text').split(',');
            const startX = parseInt(startCoordinates[0], 10);
            const startY = parseInt(startCoordinates[1], 10);
            
            game.moveExistingPiece(startX, startY, x, y);
            ui.drawBoard(handleMove, game, handleDragStart, handleDragOver, handleDrop);

            callOutDrawWin(game);
        }
    }
}

function handleAI(game) {
    if (game.playerX === 'AI' && game.currentPlayer === 'X' && game.remainingPiecesX === 0 || game.playerO === 'AI' && game.currentPlayer === 'O' && game.remainingPiecesO === 0) {
        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        game.opponentPlayer = game.opponentPlayer === 'X' ? 'O' : 'X';
        return;
    }
    
    if ((game.playerX === 'AI' && game.currentPlayer === 'X' && game.remainingPiecesX !== 0 ) || (game.playerO === 'AI' && game.currentPlayer === 'O' && game.remainingPiecesO !== 0)) {
        ai.AiMove(game)
    }
}

function assignPlayers(game) {
    if (gameMode === 'ai-vs-human') {
        game.startAs === 'X' ? game.playerO = 'AI' : game.playerX = 'AI';
    } else if (gameMode === 'ai-vs-ai') {
        game.playerX = game.playerO = 'AI';
    }
}

function callOutDrawWin(game) {
    if (game.checkDraw()) {
        game.gameState = 'Stopped';
        callOutDraw();
    } else if (game.checkWin() === 'X' || game.checkWin() === 'O') {
        callOutWinner();
    }
}

function callOutWinner() {
    let winner = game.checkWin();
    if (winner) {
        let winnerElement = document.createElement('div');
        winnerElement.classList.add('winner');
        winnerElement.innerHTML = `Player ${winner} wins!`;
        ui.gameDiv.appendChild(winnerElement);

        timer.toggleTimer(game);

        let timerButton = document.querySelector('.timer-button');
        timerButton.remove();

    }
}
function callOutDraw() {
    let draw = game.checkDraw();
    if (draw) {
        let drawElement = document.createElement('div');
        drawElement.classList.add('draw');
        drawElement.innerHTML = `Its a draw!`;
        ui.gameDiv.appendChild(drawElement);

        timer.stopTimer(game);
    }
}