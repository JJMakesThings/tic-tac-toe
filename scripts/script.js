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
        document.getElementById("overlay").style.display="block";
        document.getElementById("overlay__text").innerText=`Congratulations ${winner.name}!`      
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
        "0","1","2",
        "3","4","5",
        "6","7","8"
    ];
    return {board, turn, lastMove, checkWin, whosTurn, undoLastMove};
})();


const displayController = (function(){
    let _grid = document.getElementById("game-board")
    let _isInitialized = false;
    function initialize(){
        if (!_isInitialized){
            for(i=0; i<gameBoard.board.length; i++){
                let element = document.createElement("div");
                element["data-key"] = i;
                element.classList.add("game-space")
                element.innerText = gameBoard.board[i];
                element.addEventListener("click", (e)=> {
                    let player = gameBoard.whosTurn();
                    player.move(e.target["data-key"]);
                });
                _grid.append(element);
            };
        };
        this._isInitialized = true;
    };
    function updateGrid (){
        let elements = Array.from(_grid.querySelectorAll("div"));
        for (i=0; i<elements.length; i++){
            let space=elements[i];
            let location = space["data-key"];
            space.innerText = gameBoard.board[location];
        };
    }
    return {updateGrid, initialize};
})();

const actions = (function(){
    let _beginButton = document.getElementById("actions__begin");
    _beginButton.addEventListener("click", ()=>{
        let formPlayer1 = document.getElementById("player1").value;
        let formPlayer2 = document.getElementById("player2").value;
        console.log(formPlayer1);
        console.log(formPlayer2);
        if(formPlayer1 && formPlayer2){
            players.player1.set(formPlayer1, "X");
            players.player2.set(formPlayer2, "O");
            displayController.initialize();
            _beginButton.classList.add("inactive");
            _resetButton.classList.remove("inactive");
        };
    });
    let undoButton = document.getElementById("actions__undo");
    undoButton.addEventListener("click", (e)=>{
        console.log(e.target);
        gameBoard.undoLastMove();
        displayController.updateGrid();
        undoButton.classList.add("inactive")
    });
    let _resetButton = document.getElementById("actions__reset");
    _resetButton.addEventListener("click", (e)=>{
        location.reload();
    });
    let _playAgainButton = document.getElementById("overlay__play-again");
    _playAgainButton.addEventListener("click", (e)=>{
        location.reload();
    });
    return {undoButton}
})();

const players = (function(){
    const _mover = (state) => ({
        move(location){
            gameBoard.board[location] = state.token;
            gameBoard.turn ++;
            gameBoard.lastMove = location;
            displayController.updateGrid();
            actions.undoButton.classList.remove("inactive");
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

