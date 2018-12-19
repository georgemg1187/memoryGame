let config = {
    time: {
        startAfter: 5000,
        betweenCards: 2500
    },
    canvas: {
        name: document.getElementById("game"),
        width: 900,
        height: 720
    },
    icons: {
        number: 5,
        size: {
            width: 64,
            height: 64,
            marginX: 4,
            marginY: 4
        },
        cover: {
            front: 'images/front/icon#.png',
            back: 'images/back/back.jpg',
            checked: 'images/checked/checked.jpg'
        },
        rows: {
            x: 10,
            y: 10
        }
    },

    screens: {
        firstScreen: {
            name: document.getElementById('welcome-screen'),
            user: document.getElementsByTagName('input')[0],
            startGame: document.getElementsByTagName('button')[0],
            quitGame: document.getElementsByTagName('button')[1],
        },
        secondScreen: {
            name: document.getElementById("game-box"),
            newGame: document.querySelector("#game-info .new-game button"),
            userName: document.querySelector("#game-info .user div"),
            time: document.querySelector("#game-info .time div"),
            score: document.querySelector('#game-info .score div')
        },
        thirdScreen: {
            name: document.getElementById("game-over"),
            user: document.querySelector("#game-over .user div"),
            time: document.querySelector("#game-over .time div"),
            score: document.querySelector('#game-over .score div'),
            newGame: document.querySelector("#game-over .new-game"),
            newPlayer: document.querySelector("#game-over .new-player"),
            quitGame: document.querySelector("#game-over .quit")
        }
    }
}

function MemoryGame(config) {

    this.config = config;

    this.game = new PIXI.Application(this.config.canvas.width, this.config.canvas.height, { transparent: true, resolution: 1, atuoResize: true })
    this.config.canvas.name.appendChild(this.game.view);

    this.container = new PIXI.Container();
    this.game.stage.addChild(this.container);

    this.cards = {
        front: [],
        back: PIXI.Texture.fromImage(this.config.icons.cover.back),
        solved: PIXI.Texture.fromImage(this.config.icons.cover.checked)
    }

    this.generateCards = () => {
        for (let i = 0; i < this.config.icons.number; i++) {
            this.cards.front.push(PIXI.Texture.fromImage(this.config.icons.cover.front.replace('#', i)));
            this.cards.front.push(PIXI.Texture.fromImage(this.config.icons.cover.front.replace('#', i)));
        }
    }

    this.shuffleCards = () => {
        let temp = [...this.cards.front];

        this.cards.front = this.cards.front.map((item) => {
            return item = temp.splice(Math.floor(Math.random() * temp.length), 1)
        })

        this.cards.front = this.cards.front.flat();
    }

    this.generateCards();

    this.cards.front.forEach((card, idx) => {
        let sprite = new PIXI.Sprite();

        sprite.anchor.set(0.5);
        sprite.anchor.set(0.5);
        sprite.x = (idx % this.config.icons.rows.x) * (this.config.icons.size.width + this.config.icons.size.marginX);
        sprite.y = Math.floor(idx / this.config.icons.rows.y) * (this.config.icons.size.height + this.config.icons.size.marginY);

        this.container.addChild(sprite);
    });

    this.container.x = (this.game.screen.width - this.container.width) / 2;
    this.container.y = (this.game.screen.height - this.container.height) / 2;

    this.checkIfMatch = () => {
        this.cards.selected.forEach(card => {
            card.texture = this.cards.solved;
            card.removeAllListeners();
        })

        this.cards.selected = [];
        if (this.cards.pairs == this.config.icons.number) { this.gameOver(); }
    }

    this.noMatch = () => {
        this.cards.selected.forEach(card => {
            card.texture = this.cards.back;
        })

        this.cards.selected = [];
    }

    this.gameOver = () => {
        this.config.screens.secondScreen.name.style.display = 'none';
        this.config.screens.thirdScreen.name.style.display = "flex";
        
        this.config.screens.thirdScreen.user.textContent = this.config.screens.firstScreen.user.value;
        this.config.screens.thirdScreen.time.textContent = this.config.screens.secondScreen.time.textContent;
        this.config.screens.thirdScreen.score.textContent = this.score.current;
    }

    this.stageTimeout;
    this.cardsTimeout;
    this.matched = false;

    this.score = {
        current: 0,
        wrong: -5,
        correct: 10
    }

    this.userClick = (child, idx) => {

        if (this.cards.selected.includes(child)) return;

        clearTimeout(this.cardsTimeout);

        if (this.matched) {
            this.checkIfMatch();
            this.matched = false;
        }

        if (this.cards.selected.length == 2) { this.noMatch(); }

        this.cards.selected.push(child);

        child.texture = this.cards.front[idx];

        if (this.cards.selected.length == 2) {
            if (this.cards.selected[0].texture == this.cards.selected[1].texture) {
                this.cards.pairs++;
                this.score.current += this.score.correct;
                this.cardsTimeout = setTimeout(this.checkIfMatch, this.config.time.betweenCards);
                this.matched = true;
            }
            else {
                this.cardsTimeout = setTimeout(this.noMatch, this.config.time.betweenCards);
                this.score.current += this.score.wrong;
            }
        }

        this.config.screens.secondScreen.score.textContent = this.score.current;

    }

    this.round = {
        interval: null,
        underTen: (no) => {
            return no < 10 ? ('0' + no) : no;
        },
        roundTime: () => {
            this.round.seconds++;
            if (this.round.seconds == 60) {
                this.round.seconds = 0;
                this.round.minutes++;
            }
            if (this.round.minutes == 60) {
                this.round.minutes = 0
                this.round.hours++;
            }

            this.config.screens.secondScreen.time.textContent = this.round.underTen(this.round.hours) + ' : ' + this.round.underTen(this.round.minutes) + ' : ' + this.round.underTen(this.round.seconds);
        }
    }

    this.newStage = () => {

        this.config.screens.firstScreen.name.style.display = 'none';
        this.config.screens.thirdScreen.name.style.display = 'none';
        this.config.screens.secondScreen.name.style.display = 'flex';
        gamePage.style.display = 'flex';

        clearInterval(this.round.interval);
        clearTimeout(this.cardsTimeout);
        clearTimeout(this.stageTimeout);

        this.round.seconds = 0;
        this.round.minutes = 0;
        this.round.hours = 0;

        this.cards.pairs = 0;
        this.cards.selected = [];

        this.config.screens.secondScreen.userName.textContent = this.config.screens.firstScreen.user.value;

        this.config.screens.secondScreen.time.textContent = '00 : 00 : 00';

        this.score.current = 0;
        this.config.screens.secondScreen.score.textContent = this.score.current;


        this.shuffleCards();
        this.container.children.forEach((child, idx) => child.texture = this.cards.front[idx])

        this.stageTimeout = setTimeout(() => {
            this.container.children.forEach((child, idx) => {
                child.interactive = true;
                child.buttonMode = true;

                child.texture = this.cards.back;

            })

            this.round.interval = setInterval(this.round.roundTime, 1000);

        }, this.config.time.startAfter)

        this.container.children.forEach((child, idx) => child.on('click', this.userClick.bind(false, child, idx)));
    }

    this.startGame = () => {
        if (this.config.screens.firstScreen.user.value.replace(/ /g, '').length != 0) {
            this.newStage();
        } else {
            alert('Please enter your name');
        }
    }

    this.quitGame = () => {
        window.close();
    }

    this.newPlayer = () => {
        this.config.screens.firstScreen.name.style.display = 'flex';
        this.config.screens.thirdScreen.name.style.display = 'none';
    }

    this.config.screens.firstScreen.startGame.addEventListener('click', this.startGame);
    this.config.screens.firstScreen.quitGame.addEventListener('click', this.quitGame);

    this.config.screens.secondScreen.newGame.addEventListener('click', this.newStage);
    
    this.config.screens.thirdScreen.newGame.addEventListener('click', this.newStage);
    this.config.screens.thirdScreen.newPlayer.addEventListener('click', this.newPlayer);
    this.config.screens.thirdScreen.quitGame.addEventListener('click', this.quitGame);

}

let test = new MemoryGame(config)