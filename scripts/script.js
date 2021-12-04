const gameBoard = (function(){
    'use strict';
    function checkWin(){
        if (board[0]==board[1] && board[0]==board[2]){
            _getWinner(board[0]);
        }else if(board[0]==board[3] && board[0]==board[6]){
            return _getWinner(board[0]);
        }else if(board[0]==board[4] && board[0]==board[8]){
            return _getWinner(board[0]);
        }else if(board[8]==board[5] && board[8]==board[2]){
            return _getWinner(board[8]);
        }else if(board[8]==board[7] && board[8]==board[6]){
            return _getWinner(board[8]);
        }else if(board[2]==board[4] && board[2]==board[6]){
            return _getWinner(board[2]);
        }else if(board[3]==board[4] && board[3]==board[5]){
            return _getWinner(board[3]);
        }else if(board[1]==board[4] && board[1]==board[7]){
            return _getWinner(board[1]);
        }
    };
    function _getWinner(token){
        let winner = players.list.find(player => player.token==token);
        console.log(winner.name);
    };
    function whosTurn(){
        return (this.turn%2==0)?players.player2:players.player1
    };
    function undoLastMove(){
        this.board[this.lastMove] = "";
        this.turn --;
        this.lastMove = null;
    };
    let turn = 1;
    let lastMove;
    let board = [
        "1","2","3",
        "4","5","6",
        "7","8","9"
    ];
    return {board, turn, lastMove, checkWin, whosTurn, undoLastMove};
})();


const displayController = (function(){
    let grid = document.getElementById("game-board")
    for(i=0; i<gameBoard.board.length; i++){
        let element = document.createElement("div");
        element["data-key"] = i;
        element.classList.add("game-space")
        element.innerText = gameBoard.board[i];
        element.addEventListener("click", (e)=> {
            let player = gameBoard.whosTurn();
            player.move(e.target["data-key"]);
        });
        grid.append(element);
    }

    let undoButton = document.getElementById("actions__undo");
    undoButton.addEventListener("click", (e)=>{
        console.log(e.target);
        gameBoard.undoLastMove();
        updateGrid();
        undoButton.classList.add("inactive")
    });
    
    function updateGrid (){
        let elements = Array.from(grid.querySelectorAll("div"));
        for (i=0; i<elements.length; i++){
            let space=elements[i];
            let location = space["data-key"];
            space.innerText = gameBoard.board[location];
        };
    }
    return {updateGrid};
})();


const players = (function(){
    const _mover = (state) => ({
        move(location){
            gameBoard.board[location] = state.token;
            gameBoard.turn ++;
            gameBoard.lastMove = location;
            displayController.updateGrid();
            let undoButton = document.getElementById("actions__undo");
            undoButton.classList.remove("inactive");
            gameBoard.checkWin();
        }
    });

    const _setter = (state) => ({
        set(name, token){
            state.name = name;
            state.token = token;
        }
    });

    function _player(){
        let player = {};
        return Object.assign(
          player,
          _mover(player),
          _setter(player)
        );
    };

    let player1 = _player();
    let player2 = _player();

    let list = [player1, player2];

    return {player1, player2, list};
})();


// console stuff

players.player1.set("John", "X");
players.player2.set("Jill", "O");
