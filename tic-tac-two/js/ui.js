import { Timer } from './timer.js';


export class UI {
    constructor() {
        this.menuDiv = document.createElement('div');
        this.menuDiv.classList.add('menu-container');
        
        
        this.gameDiv = document.createElement('div');
        this.gameDiv.classList.add('game-container');
        
        document.body.appendChild(this.menuDiv);
        document.body.appendChild(this.gameDiv);
        
        this.gameDiv.style.display = 'none'; // Peidame mänguväljundi alguses
    }

    createMenu(onGameModeSelected, onMarkerSelected) {
        // Loome mängurežiimi valiku
        let gameModeHeading = document.createElement('h2');
        gameModeHeading.innerText = 'Select Game Mode';
        gameModeHeading.classList.add('menu-heading');
        this.menuDiv.appendChild(gameModeHeading);

        let humanVsHumanBtn = document.createElement('button');
        humanVsHumanBtn.innerText = 'Human vs. Human';
        this.menuDiv.appendChild(humanVsHumanBtn);
        humanVsHumanBtn.classList.add('menu-button');
        humanVsHumanBtn.addEventListener('click', () => onGameModeSelected('human-vs-human'));

        let aiVsHumanBtn = document.createElement('button');
        aiVsHumanBtn.innerText = 'AI vs. Human';
        this.menuDiv.appendChild(aiVsHumanBtn);
        aiVsHumanBtn.classList.add('menu-button');
        aiVsHumanBtn.addEventListener('click', () => onGameModeSelected('ai-vs-human'));

        let aiVsAiBtn = document.createElement('button');
        aiVsAiBtn.innerText = 'AI vs. AI';
        this.menuDiv.appendChild(aiVsAiBtn);
        aiVsAiBtn.classList.add('menu-button');
        aiVsAiBtn.addEventListener('click', () => onGameModeSelected('ai-vs-ai'));
    }

    hideMenu() {
        this.menuDiv.style.display = 'none';
    }

    showMarkerSelection(onMarkerSelected) {
        // Peidame menüü ja kuvame mängija märgi valiku
        this.menuDiv.innerHTML = '';  // Eemaldame olemasoleva sisu
        let markerHeading = document.createElement('h2');
        markerHeading.innerText = 'Select Your Marker';
        markerHeading.classList.add('menu-heading');
        this.menuDiv.appendChild(markerHeading);

        let playAsXBtn = document.createElement('button');
        playAsXBtn.innerText = 'Play as X';
        this.menuDiv.appendChild(playAsXBtn);
        playAsXBtn.classList.add('menu-button');
        playAsXBtn.addEventListener('click', () => onMarkerSelected('X'));

        let playAsOBtn = document.createElement('button');
        playAsOBtn.innerText = 'Play as O';
        this.menuDiv.appendChild(playAsOBtn);
        playAsOBtn.classList.add('menu-button');
        playAsOBtn.addEventListener('click', () => onMarkerSelected('O'));
    }

    generateGame(handleMove, game, timer, handleDragStart, handleDragOver, handleDrop) {
        this.gameDiv.innerHTML = ''; // Eemaldame olemasoleva mängu
        
        this.gameDiv.style.display = 'block';
        this.gameDiv.classList.add('game-container');
        
        let timerContainer = timer.createTimer(game);
        this.gameDiv.appendChild(timerContainer);
        
        let resetButton = this.resetButton(handleMove, game, timer, handleDragStart, handleDragOver, handleDrop);
        this.gameDiv.appendChild(resetButton);

        let placeNew = this.createRadioButton('placeNew', 'Place New Piece');
        let moveExisting = this.createRadioButton('moveExisting', 'Move Existing Piece');
        let moveGrid = this.createRadioButton('moveGrid', 'Move Grid');

        // Lisa event listeners
        placeNew.querySelector('input').addEventListener('change', (e) => {
            game.selectedAction = 'placeNew';
        });
        moveExisting.querySelector('input').addEventListener('change', (e) => {
            game.selectedAction = 'moveExisting';
        });
        moveGrid.querySelector('input').addEventListener('change', (e) => {
            game.selectedAction = 'moveGrid';
        });

        this.gameDiv.appendChild(placeNew);
        this.gameDiv.appendChild(moveExisting);
        this.gameDiv.appendChild(moveGrid);

        let infoPanel = this.createPlayerInfoPanel(game);
        this.gameDiv.appendChild(infoPanel);

        let board = this.getInitialBoard(handleMove, game.gridStartX, game.gridStartY, handleDragStart, handleDragOver, handleDrop, game);
        this.gameDiv.appendChild(board);
        
    }

    getInitialBoard(cellUpdateFn, gridX, gridY, handleDragStart, handleDragOver, handleDrop, game) {
        let board = document.createElement('div');
        board.classList.add("board");

        // Create the outer 5x5 grid (this will be the entire board)
        for (let i = 0; i < 5; i++) {
            let row = document.createElement('div');
            row.classList.add('row');

            for (let j = 0; j < 5; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');

                cell.addEventListener("click", (event) => { cellUpdateFn(i, j, event) });

                cell.setAttribute('draggable', 'true');
                cell.addEventListener('dragstart', (event) => handleDragStart(event, i, j)); // When the drag starts
                cell.addEventListener('dragover', (event) => handleDragOver(event)); // When dragging over a cell
                cell.addEventListener('drop', (event) => handleDrop(event, i, j)); // When drop happens

                // Set cell content based on boardState
                cell.innerHTML = game.board[i][j] || "&nbsp;";

                // Check if the cell is part of the 3x3 grid (center area) based on gridX and gridY
                if (i >= gridX && i < gridX + 3 && j >= gridY && j < gridY + 3) {
                    cell.classList.add("grid-cell");  // Style these cells differently
                }

                row.appendChild(cell);
            }

            // Append each row to the grid container
            board.appendChild(row);
        }

        // Return the board element
        return board;
    }
    
    resetButton(handleMove, game, timer, handleDragStart, handleDragOver, handleDrop) {
        let resetButton = document.createElement('button');
        resetButton.innerHTML = 'Reset';
        resetButton.classList.add('reset-button');
        
        resetButton.addEventListener('click', () => {
            game.resetGame();
            timer.resetTimer();
            this.clearGame();
            this.generateGame(handleMove, game, timer, handleDragStart, handleDragOver, handleDrop);
        });
        
        return resetButton;
    }
    
    clearGame() {
        this.gameDiv.innerHTML = '';
    }
    
    createRadioButton(id, label) {
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.id = id;
        radioButton.name = 'gameOption';
        radioButton.value = id;

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.innerHTML = label;

        const wrapper = document.createElement('div');
        wrapper.appendChild(radioButton);
        wrapper.appendChild(labelElement);
        return wrapper;
    }
    
    createPlayerInfoPanel(game) {

        let playerInfoPanel = document.createElement('div');
        playerInfoPanel.classList.add('player-info-panel');
        
        let currentPlayer = document.createElement('div');
        currentPlayer.classList.add('current-player');
        currentPlayer.innerHTML = `Current Player: ${game.currentPlayer}`;
        
        let remainingPiecesX = document.createElement('div');
        remainingPiecesX.classList.add('remaining-pieces-x');
        remainingPiecesX.innerHTML = `Remaining Pieces X: ${game.remainingPiecesX}`;
        
        let remainingPiecesO = document.createElement('div');
        remainingPiecesO.classList.add('remaining-pieces-O');
        remainingPiecesO.innerHTML = `Remaining Pieces O: ${game.remainingPiecesO}`;
        
        playerInfoPanel.appendChild(currentPlayer);
        playerInfoPanel.appendChild(remainingPiecesX);
        playerInfoPanel.appendChild(remainingPiecesO);
        
        return playerInfoPanel;
    }

    drawBoard(handleMove, game, handleDragStart, handleDragOver, handleDrop) {
        let infoPanel = document.querySelector('.player-info-panel');
        infoPanel.remove();

        infoPanel = this.createPlayerInfoPanel(game);
        this.gameDiv.appendChild(infoPanel);

        let board = document.querySelector('.board');
        board.remove();

        board = this.getInitialBoard(handleMove, game.gridStartX, game.gridStartY, handleDragStart, handleDragOver, handleDrop, game);
        this.gameDiv.appendChild(board);
    }
    
}
