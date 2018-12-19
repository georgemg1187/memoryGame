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
        number: 50,
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
    gameInfo: {
        newGame: newGameBtn,
        user: userName,
        timmer: timmer,
        score: roundScore
    },
    doom: {
        firstScreen: {
            name: document.getElementById('welcome-screen'),
            user: document.getElementsByTagName('input')[0],
            startGame: document.getElementsByTagName('button')[0]
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
            quitGame: document.getElementById("game-over .quite")
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
        solved: PIXI.Texture.fromImage(this.config.icons.cover.checked),
        selected: [],
        pairs: 0
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
    }

    this.noMatch = () => {
        this.cards.selected.forEach(card => {
            card.texture = this.cards.back;
        })

        this.cards.selected = [];
    }

    this.gameOver = () => {
        this.config.doom.secondScreen.name.style.display = "none";
        this.config.doom.thirdScreen.name.style.display = "felx";
    }

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

        this.config.doom.secondScreen.score.textContent = this.score.current;
        if (this.cards.pairs == this.config.icons.number) { this.gameOver }
    }

    this.round = {
        interval: null,
        seconds: 0,
        minutes: 0,
        hours: 0,
        roundTime: () => {
            this.round.start++;
            if (this.round.seconds == 60) {
                this.round.seconds = 0;
                this.minutes++;
            }
            if (this.round.minutes == 60) {
                this.round.minutes = 0
                this.round.hours++;
            }
        }
    }

    this.newGame = () => {

        this.config.doom.secondScreen.userName.textContent = this.config.doom.firstScreen.user.value;

        this.score.current = 0;
        this.config.doom.secondScreen.score.textContent = this.score.current;

        this.container.children.forEach((child, idx) => child.texture = this.cards.front[idx])

        setTimeout(() => {
            this.container.children.forEach((child, idx) => {
                child.interactive = true;
                child.buttonMode = true;

                child.texture = this.cards.back;
            })
        }, this.config.time.startAfter)

        this.container.children.forEach((child, idx) => child.on('click', this.userClick.bind(false, child, idx)));
    }

    this.startGame = () => {
        if (this.config.doom.firstScreen.user.value.replace(/ /g, '').length != 0) {
            this.config.doom.firstScreen.name.style.display = 'none';
            gamePage.style.display = 'flex';

            this.newGame();
        } else {
            alert('Please enter your name');
        }
    }

    this.config.doom.firstScreen.startGame.addEventListener('click', this.startGame);
}

let test = new MemoryGame(config)