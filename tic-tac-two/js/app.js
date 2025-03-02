import * as UI from './ui.js';
import { GameBrain} from './game.js';

let h1 = document.createElement('h1');
h1.innerHTML = 'TIC TAC TWO';
document.body.appendChild(h1);

let game = new GameBrain();

function cellUpdateFn(x, y, event) {
    game.makeAMove(x, y);
    event.target.innerHTML = game.board[x][y] || "&nbsp;";
}

function handleMove(x, y, e) {
    // if (game.gameState === 'Stopped') {
    //    return;
    // }

    if (game.remainingPiecesX === 0 && game.remainingPiecesO === 0) {
        return;
    }

    game.makeAMove(x, y);
    e.target.innerHTML = game.board[x][y] || "&nbsp;";
    
    // if move = makeAMove then game.makeAMove(x, y); event.target.innerHTML = game.board[x][y] || "&nbsp;"; )
    // else if move = moveExistingPiece then game.moveExistingPiece(oldX, oldY, newX, newY); event.target.innerHTML = game.board[x][y] || "&nbsp;"; )
    // else if move = moveGrid then game.moveGrid(x, y); event.target.innerHTML = game.board[x][y] || "&nbsp;"; )

    let winner = game.checkWin();
    if (winner) {
        let winnerElement = document.createElement('div');
        winnerElement.classList.add('winner');
        winnerElement.innerHTML = `Player ${winner} wins!`;
        document.body.appendChild(winnerElement);

        ui.stopTimer(game);

        generateResetButton();

        let timerButton = document.querySelector('.timer-button');
        timerButton.remove();
    }

    let draw = game.checkDraw();
    if (draw) {
        let drawElement = document.createElement('div');
        drawElement.classList.add('draw');
        drawElement.innerHTML = `It's a draw!`;
        document.body.appendChild(drawElement);

        ui.stopTimer(game);

        generateResetButton();

        let timerButton = document.querySelector('.timer-button');
        timerButton.remove();
    }

}


let board = UI.getInitialBoard(game.board, handleMove);
document.body.appendChild(board);