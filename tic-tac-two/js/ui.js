export function getInitialBoard(boardState, cellUpdateFn) {
    let board = document.createElement('div');
    board.classList.add("board");
    
    // Create a 3x3 grid container
    let gridContainer = document.createElement('div');
    gridContainer.classList.add("grid-container");

    // Create the outer 5x5 grid (this will be the entire board)
    for (let i = 0; i < 5; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');

            cell.addEventListener("click", (event) => { cellUpdateFn(i, j, event) });

            // Set cell content based on boardState
            cell.innerHTML = boardState[i][j] || "&nbsp;";

            // Check if the cell is part of the 3x3 grid (center area)
            if (i >= 1 && i <= 3 && j >= 1 && j <= 3) {
                cell.classList.add("grid-cell");  // Style these cells differently
            }

            row.appendChild(cell);
        }
        
        // Append each row to the grid container
        gridContainer.appendChild(row);
    }

    // Append the grid container to the board
    board.appendChild(gridContainer);

    return board;
}

