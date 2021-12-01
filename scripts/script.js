const gameBoard = function(){
    'use strict';
    function _checkWin(){
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
        }
    };
    function _getWinner(token){
        let winner = game.players.find(player => player.token==token);
        console.log(winner.name);
    };
    let board = [
        "0","1","2",
        "3","4","5",
        "6","7","8",
    ];
    function move(location, player){
        board[location] = player.token;
        _checkWin();
    };
    return {board, move};
}();


const displayController = function(){
    return {};
}();


const game = function(){
    let players = [];
    function _player(name, token){
        return {name, token}
    }
    const createPlayer = function(name, token){
        const player = _player(name, token);
        players.push(player);
        return player
    }
    return {createPlayer, players};
}();



// console stuff

let player1 = game.createPlayer("John", "X");
let player2 = game.createPlayer("Jill", "O");
gameBoard.move(0, player2);
gameBoard.move(1, player2);
gameBoard.move(2, player2);