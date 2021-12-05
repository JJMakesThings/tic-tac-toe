const gameBoard = (function(){
    'use strict';
    function checkWin(token){
        if (board[0]==token && board[1]==token && board[2]==token ||
            board[3]==token && board[4]==token && board[5]==token ||
            board[6]==token && board[7]==token && board[8]==token ||
            board[0]==token && board[3]==token && board[6]==token ||
            board[1]==token && board[4]==token && board[7]==token ||
            board[2]==token && board[5]==token && board[8]==token ||
            board[0]==token && board[4]==token && board[8]==token ||
            board[2]==token && board[4]==token && board[6]==token){
            return _getWinner(token);
        } else if (this.turn>9){
            return _getWinner();
        }
    };
    function _getWinner(token){
        if(token){
            let winner = players.list.find(player => player.token==token);
            document.getElementById("overlay__text").innerText=`Congratulations ${winner.name}!`   
        } else {
            document.getElementById("overlay__text").innerText="It's a Draw"
        };
        document.getElementById("overlay").style.display="block"; 
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
        "","","",
        "","","",
        "","",""
    ];
    return {board, turn, lastMove, checkWin, whosTurn, undoLastMove};
})();


const displayController = (function(){
    let _grid = document.getElementById("game-board")
    let _isInitialized = false;
    function initialize(){
        if (!_isInitialized){
            _grid.style.backgroundColor="grey";
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
        let formPlayer1 = document.getElementById("player1");
        let formPlayer2 = document.getElementById("player2");
        formPlayer1.setAttribute("readonly", "true");
        formPlayer2.setAttribute("readonly", "true");
        if(formPlayer1.value && formPlayer2.value){
            players.player1.set(formPlayer1.value, "X");
            players.player2.set(formPlayer2.value, "O");
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
            gameBoard.checkWin(state.token);
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

