let controller;
let graphicController;


// Player creation factory function
function createPlayer(type, name) {
    const mark = type;
    const playerName = name;
    let wins = 0;
    const getWins = () => wins;
    const giveWins = () => { wins++; };

    return { mark, playerName, getWins, giveWins };
}

// Game controller factory function
function GameController (p1, p2) {
    const player1 = createPlayer('X', p1);
    const player2 = createPlayer('O', p2);
    const players = [player1, player2];
    let activePlayer = players[0];
    let gameState = false;

    const handleTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    let table = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const playRound = (row, column) => {
        

        if(table[row][column] !== ''){
            return;
        }

        table[row][column] = activePlayer.mark;

        const columnWin = checkColumnWin();
        const rowWin = checkRowWin();
        const diagWin = checkDiagonalWin();

        if(columnWin.win|| rowWin.win || diagWin.win){
            activePlayer.giveWins();
            gameState = true;
            return;
        } else if(!columnWin.win && !rowWin.win && !diagWin.win && isGameTied()){
            gameState = true;
            return;
        } 
        
        handleTurn();
    }

    
    const checkColumnWin = () => {
        for(let col = 0; col < 3; col++){
            const top = table[0][col];
            const middle = table[1][col];
            const bottom = table[2][col];

            if(top !== '' && top === middle && middle === bottom){
                return { win: true, winner: top }
            }
        }
        return { win: false };
    }

    const checkRowWin = () => {
        for(let row = 0; row < 3; row++){
            const top = table[row][0];
            const middle = table[row][1];
            const bottom = table[row][2];

            if(top !== '' && top === middle && middle === bottom){
                return { win: true, winner: top };
            }
        }
        return { win: false };
    }

    const checkDiagonalWin = () => {
        const topLeft = table[0][0];
        const center = table[1][1];
        const bottomRight = table[2][2];
        const topRight = table[0][2];
        const bottomLeft = table[2][0];

        if((topRight !== '' && topRight === center && center === bottomLeft) || (topLeft !== '' && topLeft === center && center === bottomRight)){
            return { win: true, winner: center }
        } else {
            return { win: false }
        }
    }

    const restartGame = () => {
        table = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        gameState = false;
    }

    const checkGameState = () => gameState;

    const isGameTied = () => {
        return !table.some(row => row.includes(''));
    }

    const getTable = () => {
        return table;
    }

    const getScores = () => {
        return { X: player1.getWins(), O: player2.getWins() }
    }

    const getNames = () => {
        return { X: player1.playerName, O: player2.playerName }    
    }

    const getActivePlayerMarker = () => {
        return activePlayer.mark; 
    }

    return { playRound, getTable, checkGameState, restartGame, getScores, getNames, getActivePlayerMarker };
}


// The welcome form initializes the game...
const welcomeForm = document.getElementById('welcome-form');

welcomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const player1Name = document.getElementById('player-one-name');
    const player2Name = document.getElementById('player-two-name');
    controller = GameController(player1Name.value, player2Name.value);
    graphicController = graphicInterface();
    const names = controller.getNames();
    graphicController.setNames(names.X, names.O);
    graphicController.setInvisible();
});

// Graphic interface factory function
const graphicInterface = () => {
    const resetGame = (gameState) => {
        if(gameState){
            const body = document.body;
            const resetButton = document.createElement('button');
            resetButton.innerText = 'Reset?';
            resetButton.classList.add('reset-btn');

            if(body.querySelector('.reset-btn')){
                return;
            }

            document.body.appendChild(resetButton);
            resetButton.addEventListener('click', () => {
                controller.restartGame();
                cleanTable();
                removeResetButton();
                removeSquarePaint();
            });

        }
    }
    const cleanTable = () => {
        squares.forEach(square => {
            square.innerText = '';
        });
    }

    const removeResetButton = () => {
        const buttonToRemove = document.querySelector('body > .reset-btn');
        if(buttonToRemove){
            buttonToRemove.remove();
        }
    }

    const displayWins = (player1, player2) => {
        const player1Score = document.querySelector('#player-one-score');
        const player2Score = document.querySelector('#player-two-score');

        player1Score.innerText = player1;
        player2Score.innerText = player2;
    }

    const setNames = (p1, p2) => {  
        const player1Name = document.querySelector('.player-one-name');
        const player2Name = document.querySelector('.player-two-name');
        player1Name.textContent = p1;
        player2Name.textContent = p2;
    }
    
    const setInvisible = () => {
        const tableElement = document.getElementById('table');
        const welcomeFormElement = document.getElementById('welcome-form');
        const playersContainereElement = document.getElementById('players-container');

        // We remove the invisible class from this ones
        tableElement.classList.remove('invisible');
        playersContainereElement.classList.remove('invisible');

        // We add the invisible class to the welcome form
        welcomeFormElement.classList.add('invisible');
    }

    const paintSquares = (square) => {
        const currentPlayerMark = controller.getActivePlayerMarker();
        if(square.classList.contains('player-X') || square.classList.contains('player-O')){
            return;
        }
        
        square.classList.add(`player-${currentPlayerMark}`);
    }

    const removeSquarePaint = () => {
        squares.forEach(square => {
            square.classList.remove('player-X');
            square.classList.remove('player-O');
        })
    }

    return { resetGame, displayWins, setNames, setInvisible, paintSquares };
}


const squares = document.querySelectorAll('.square');

squares.forEach(square => {
    square.addEventListener('click', () => {
        const table = controller.getTable();
        let gameState = controller.checkGameState();
        let scores = controller.getScores();
        if(gameState){
            graphicController.resetGame(gameState);
            graphicController.displayWins(scores.X, scores.O);
            return;
        } else {
            graphicController.paintSquares(square);
            controller.playRound(Number(square.id[0]), Number(square.id[2]));
            square.textContent = table[square.id[0]][square.id[2]];
            gameState = controller.checkGameState();
            scores = controller.getScores();
            if(gameState){
                graphicController.resetGame(gameState);
                graphicController.displayWins(scores.X, scores.O);
                return;
            }
        }
    });
});




