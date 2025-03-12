import {Timer} from "./timer.ts";
import {GameBrain} from "./game.ts";

export class UI {
    menuDiv: HTMLElement;
    gameDiv: HTMLElement;
    constructor() {
        this.menuDiv = this.createElement('div', 'menu-container');
        this.gameDiv = this.createElement('div', 'game-container', { display: 'none' });
        this.createContainers();
    }
    private createContainers(): void {
        document.body.append(this.menuDiv, this.gameDiv);
    }

    private createElement(tag: string, className: string, properties: Record<string, any> = {}): HTMLElement {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);
        Object.assign(element, properties);
        return element;
    }

    createHeading(text: string): HTMLElement {
        return this.createElement('h2', 'menu-heading', { innerText: text });
    }

    createButton(text: string, onClick: () => void, className: string = 'menu-button'): HTMLElement {
        const button = this.createElement('button', className, { innerText: text });
        button.addEventListener('click', onClick);
        return button;
    }

    createRadioButton(id: string, label: string): HTMLDivElement {
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

    createMenu(onGameModeSelected: (mode: string) => void): void {
        this.menuDiv.innerHTML = '';
        this.menuDiv.appendChild(this.createHeading('Select Game Mode'));

        const gameModes = [
            { text: 'Human vs. Human', mode: 'human-vs-human' },
            { text: 'AI vs. Human', mode: 'ai-vs-human' },
            { text: 'AI vs. AI', mode: 'ai-vs-ai' }
        ];

        gameModes.forEach(({ text, mode }) => {
            const button = this.createButton(text, () => onGameModeSelected(mode));
            this.menuDiv.appendChild(button);
        });
    }

    showMarkerSelection(onMarkerSelected: (marker: string) => void): void {
        this.menuDiv.innerHTML = '';
        this.menuDiv.appendChild(this.createHeading('Select Your Marker'));

        const markers = ['X', 'O'];
        markers.forEach(marker => {
            const button = this.createButton(`Play as ${marker}`, () => onMarkerSelected(marker));
            this.menuDiv.appendChild(button);
        });
    }

    generateGame(handleMove: (x: number, y: number, event: Event) => void, game: GameBrain, timer: Timer, handleDragStart: (event: DragEvent, x: number, y: number) => void, handleDragOver: (event: DragEvent) => void, handleDrop: (event: DragEvent, x: number, y: number) => void) {
        this.clearGame();

        this.gameDiv.append(
            timer.createTimer(game),
            this.resetButton(handleMove, game, timer, handleDragStart, handleDragOver, handleDrop),
            this.createGameOptions(game),
            this.createPlayerInfoPanel(game),
            this.getInitialBoard(handleMove, game.gridStartX, game.gridStartY, handleDragStart, handleDragOver, handleDrop, game)
        );
    }

    resetButton(handleMove: (x: number, y: number, event: Event) => void, game: GameBrain, timer: Timer, handleDragStart: (event: DragEvent, x: number, y: number) => void, handleDragOver: (event: DragEvent) => void, handleDrop: (event: DragEvent, x: number, y: number) => void) {
        return this.createButton('Reset', () => {
            game.resetGame();
            timer.resetTimer();
            this.clearGame();
            this.generateGame(handleMove, game, timer, handleDragStart, handleDragOver, handleDrop);
        }, 'reset-button');
    }

    createGameOptions(game: GameBrain) {
        const actions = [
            { id: 'placeNew', label: 'Place New Piece' },
            { id: 'moveExisting', label: 'Move Existing Piece' },
            { id: 'moveGrid', label: 'Move Grid' }
        ];

        const container = this.createElement('div', 'game-options');

        actions.forEach(({ id, label }) => {
            const radioButton = this.createRadioButton(id, label);
            radioButton.querySelector('input')?.addEventListener('change', () => {
                game.selectedAction = id;
            });
            container.appendChild(radioButton);
        });

        return container;
    }

    createPlayerInfoPanel(game: GameBrain) {
        const panel = this.createElement('div', 'player-info-panel');

        const info = [
            { class: 'current-player', text: `Current Player: ${game.currentPlayer}` },
            { class: 'remaining-pieces-x', text: `Remaining Pieces X: ${game.remainingPiecesX}` },
            { class: 'remaining-pieces-O', text: `Remaining Pieces O: ${game.remainingPiecesO}` }
        ];

        info.forEach(({ class: className, text }) => {
            panel.appendChild(this.createElement('div', className, { innerHTML: text }));
        });

        return panel;
    }

    getInitialBoard(cellUpdateFn: (x: number, y: number, event: Event) => void, gridX: number, gridY: number, handleDragStart: (event: DragEvent, x: number, y: number) => void, handleDragOver: (event: DragEvent) => void, handleDrop: (event: DragEvent, x: number, y: number) => void, game: GameBrain) {
        let board = this.createElement('div', 'board');

        for (let i = 0; i < 5; i++) {
            let row = this.createElement('div', 'row');

            for (let j = 0; j < 5; j++) {
                let cell = this.createElement('div', 'cell', { innerHTML: game.board[i][j] || "&nbsp;" });

                cell.addEventListener("click", (event) => { cellUpdateFn(i, j, event) });

                cell.setAttribute('draggable', 'true');
                cell.addEventListener('dragstart', (event) => handleDragStart(event, i, j));
                cell.addEventListener('dragover', (event) => handleDragOver(event));
                cell.addEventListener('drop', (event) => handleDrop(event, i, j));

                if (i >= gridX && i < gridX + 3 && j >= gridY && j < gridY + 3) {
                    cell.classList.add("grid-cell");
                }

                row.appendChild(cell);
            }
            board.appendChild(row);
        }
        return board;
    }

    drawBoard(handleMove: (x: number, y: number, event: Event) => void, game: GameBrain, handleDragStart: (event: DragEvent, x: number, y: number) => void, handleDragOver: (event: DragEvent) => void, handleDrop: (event: DragEvent, x: number, y: number) => void) {
        let infoPanel = document.querySelector('.player-info-panel');
        infoPanel?.remove();

        infoPanel = this.createPlayerInfoPanel(game);
        this.gameDiv.appendChild(infoPanel);

        let board = document.querySelector('.board');
        board?.remove();

        board = this.getInitialBoard(handleMove, game.gridStartX, game.gridStartY, handleDragStart, handleDragOver, handleDrop, game);
        this.gameDiv.appendChild(board);
    }

    hideMenu() {
        this.menuDiv.style.display = 'none';
    }

    clearGame() {
        this.gameDiv.innerHTML = '';
    }

}
