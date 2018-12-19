let introPage = document.getElementById('welcome-screen');
let userName = document.getElementsByTagName('input')[0]
let startGameBtn = document.getElementsByTagName('button')[0]
let quitGame  = document.getElementsByTagName('button')[1]
let gamePage = document.getElementById('game-box');
let gameApp = document.getElementById('game');

let newGameBtn = document.querySelector('#new-game button');
let timmer = document.querySelector('#timmer div');
let roundScore = document.querySelector('#score div');

// startGameBtn.addEventListener('click', startGame);
// quitGame.addEventListener('click', endGame);


// function startGame() {
//     if (userName.value.replace(/ /g, '').length != 0 ) {
//         introPage.style.display = 'none';
//         gamePage.style.display = 'flex';

//         let theGame = new MemoryGame(config)
//         theGame.newGame();
//     } else {
//         alert ('Please enter your name');
//     }
// }

// function endGame() {
//     window.close();
// }