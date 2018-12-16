let introPage = document.getElementById('welcome-screen');
let userName = document.getElementsByTagName('input')[0]
let newGame = document.getElementsByTagName('button')[0]
let quitGame  = document.getElementsByTagName('button')[1]
let gamePage = document.getElementById('game');

newGame.addEventListener('click', startGame);
quitGame.addEventListener('click', endGame);

function startGame() {
    if (userName.value.replace(/ /g, '').length != 0 ) {
        introPage.style.display = 'none';
        gamePage.style.display = 'block';

        var test = new MemoryGame(config);
    } else {
        alert ('Please enter your name');
    }
}

function endGame() {
    window.close();
}