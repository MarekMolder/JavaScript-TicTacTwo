import { UI } from './ui.js';
import { GameBrain } from './game.js';
import { Timer } from './timer.js';


let h1 = document.createElement('h1');
h1.innerHTML = 'TIC TAC TWO';
document.body.appendChild(h1);


// Loome UI objekti
let ui = new UI();

// Loome mängu, ajastaja ja mängija algseadistused
let game, timer, startAs, gameMode;

// Kui UI on valmis, kuvame menüü
ui.createMenu(handleGameModeSelection, handleMarkerSelection);

// Funktsioon mängurežiimi valikuks
function handleGameModeSelection(mode) {
    console.log('Selected mode:', mode);
    gameMode = mode;
    ui.showMarkerSelection(handleMarkerSelection);
}

// Funktsioon mängija märgi valikuks
function handleMarkerSelection(marker) {
    console.log('Selected marker:', marker);
    startAs = marker;
    startGame();
}

// Funktsioon mängu alustamiseks
function startGame() {
    ui.hideMenu();
    game = new GameBrain(gameMode, startAs);
    timer = new Timer();
    ui.generateGame(handleMove, h1, game, timer, handleDragStart, handleDrop, handleDragOver);  // Kuvame mänguväljundi
}



function handleMove(x, y, e) {
    
    if (game.remainingPiecesX === 0 && game.remainingPiecesO === 0) {
        return;
    }
    
    if (game.gameState === 'Stopped') {
        return;
    }
    
    console.log(timer.timerRunning);
    
    if (game.selectedAction === 'placeNew') {
        game.makeAMove(x, y);
        drawBoard();
    }  else if (game.selectedAction === 'moveGrid') {
        game.moveGrid(x, y);
        drawBoard();
    }
    
    e.target.innerHTML = game.board[x][y] || "&nbsp;";
    
    if (game.checkDraw()) {
        game.gameState = 'Stopped';
        callOutDraw();
    } else if (game.checkWin() === 'X') {
        callOutWinner();
    } else if (game.checkWin() === 'O') {
        callOutWinner();
    }
}

// Drag-and-drop sündmused ja loogika
function handleDragStart(event, x, y) {
    // Salvesta alguspunkt (x, y) drag-and-drop jaoks
    game.dragStartX = x;
    game.dragStartY = y;
    event.dataTransfer.setData('text', `${x},${y}`); // Säilita algkoordinaadid
}

function handleDragOver(event) {
    event.preventDefault(); // Vältige vaikimisi käitumist (vaja, et drop toimuks)
}

function handleDrop(event, x, y) {
    if (game.gameState === 'Stopped') {
        return;
    }
    if (game.selectedAction === 'moveExisting') {
        event.preventDefault();

        const startCoordinates = event.dataTransfer.getData('text').split(',');
        const startX = parseInt(startCoordinates[0], 10);
        const startY = parseInt(startCoordinates[1], 10);

        // Kui liigutatakse olemasolev tükk, siis liiguta see vastavalt alguspunktist sihtpunkti
        game.moveExistingPiece(startX, startY, x, y);
        drawBoard(); // Uuenda lauda

        if (game.checkDraw()) {
            game.gameState = 'Stopped';
            callOutDraw();
        } else if (game.checkWin() === 'X') {
            callOutWinner();
        } else if (game.checkWin() === 'O') {
            callOutWinner();
        }
    }

}

function drawBoard() {
    let infoPanel = document.querySelector('.player-info-panel');
    infoPanel.remove();

    infoPanel = ui.createPlayerInfoPanel(game);
    ui.gameDiv.appendChild(infoPanel);
    
    let board = document.querySelector('.board');
    board.remove();

    board = ui.getInitialBoard(handleMove, game.gridStartX, game.gridStartY, handleDragStart, handleDragOver, handleDrop, game);
    ui.gameDiv.appendChild(board);
}

function callOutWinner() {
    let winner = game.checkWin();
    if (winner) {
        let winnerElement = document.createElement('div');
        winnerElement.classList.add('winner');
        winnerElement.innerHTML = `Player ${winner} wins!`;
        document.body.appendChild(winnerElement);

        console.log(timer.timerRunning);
        timer.toggleTimer(game);
        console.log(game.gameState);
        console.log(timer.timerRunning);
        

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
        document.body.appendChild(drawElement);

        timer.stopTimer(game);


    }
}