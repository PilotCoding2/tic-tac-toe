function createPlayer(type) {
    const mark = type;
    let wins = 0;
    const getWins = () => wins;
    const giveWins = () => { wins++; };

    return { mark, getWins, giveWins};
}

function GameController () {
    const player1 = createPlayer('X');
    const player2 = createPlayer('O');
    const players = [player1, player2];
    let activePlayer = players[0];

    const handleTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    let table = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const playRound = (row, column) => {
        const columnWin = checkColumnWin();
        const rowWin = checkRowWin();
        const diagWin = checkDiagonalWin();

        if(columnWin.win|| rowWin.win || diagWin.win){
            return;
        }

        if(table[row][column] === ''){
            table[row][column] = activePlayer.mark;
            handleTurn();
        }
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

    return { playRound, table };
}

const controller = GameController();

const squares = document.querySelectorAll('.square');
squares.forEach(square => {
    square.addEventListener('click', () => {
        controller.playRound(Number(square.id[0]), Number(square.id[2]))
        square.textContent = controller.table[square.id[0]][square.id[2]];
    });
});