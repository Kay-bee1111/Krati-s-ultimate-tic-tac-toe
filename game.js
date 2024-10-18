let currentPlayer = 'X'; // Start with player X
let largeGridWinners = Array(9).fill(null); // To track who wins each large grid
let smallGrids = document.querySelectorAll('.large-cell');
let smallCells = document.querySelectorAll('.small-cell');
let nextGridRestriction = null; // Stores which large grid the next player is restricted to

smallCells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(event) {
    const cell = event.target;
    const largeCell = cell.parentElement;
    
    const largeCellIndex = parseInt(largeCell.id.replace('big', '')) - 1;
    const smallCellIndex = [...largeCell.children].indexOf(cell);

    // If restricted to a grid, check if this move is valid
    if (nextGridRestriction !== null && largeCellIndex !== nextGridRestriction) {
        alert("You must play in the highlighted grid.");
        return;
    }

    // Update the small cell with the current player symbol
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === 'X' ? 'red' : 'blue';

    // Check if the player wins the small grid
    checkSmallGridWinner(largeCell);

    // Determine the next grid restriction based on the position in the current grid
    restrictNextMove(smallCellIndex);

    // Switch the player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // Check if any large grid forms a row, column, or diagonal win
    checkLargeGridWinner();
}

function restrictNextMove(smallCellIndex) {
    const nextGrid = smallCellIndex; // Use the same small cell index as the large grid restriction
    if (largeGridWinners[nextGrid] === null) {
        highlightGrid(nextGrid);
        nextGridRestriction = nextGrid; // Restrict to the grid that matches the small cell index
    } else {
        nextGridRestriction = null; // If the next grid is already won, remove restriction
        removeGridHighlight();
    }
}

function highlightGrid(gridIndex) {
    removeGridHighlight(); // Remove previous highlight
    document.querySelectorAll('.large-cell').forEach((grid, index) => {
        if (index === gridIndex) {
            grid.style.outline = "3px solid yellow"; // Highlight with yellow border
        } else {
            grid.style.outline = "none";
        }
    });
}

function removeGridHighlight() {
    document.querySelectorAll('.large-cell').forEach(grid => {
        grid.style.outline = "none"; // Remove outline from all grids
    });
}

function checkSmallGridWinner(largeCell) {
    const cells = largeCell.querySelectorAll('.small-cell');
    const id = parseInt(largeCell.id.replace('big', '')) - 1;

    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            largeGridWinners[id] = cells[a].textContent; // Store the winner of this large grid
            largeCell.style.backgroundColor = cells[a].textContent === 'X' ? 'red' : 'blue'; // Change large cell color
            break;
        }
    }
}

function checkLargeGridWinner() {
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let line of winningLines) {
        const [a, b, c] = line;
        if (largeGridWinners[a] && largeGridWinners[a] === largeGridWinners[b] && largeGridWinners[a] === largeGridWinners[c]) {
            // Player wins the game
            const winner = largeGridWinners[a];
            const color = winner === 'X' ? 'red' : 'blue';
            changeAllGridColors(color);
            displayWinner(winner);
            return;
        }
    }
}

function changeAllGridColors(color) {
    smallCells.forEach(cell => {
        cell.style.backgroundColor = color;
    });
}

function displayWinner(winner) {
    setTimeout(() => {
        alert(`${winner === 'X' ? 'Player 1' : 'Player 2'} wins!`);
    }, 100);
}
