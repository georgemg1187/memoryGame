let config = {
    user: userName.value,
    time: {
        startAfter: 5000,
        betweenCards: 2500
    },
    canvas: {
        name: gameApp,
        width: 900,
        height: 720
    },
    icons: {
        number: 50,
        size: {
            width: 64,
            height: 64,
            marginX: 20,
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
    }
}

function MemoryGame(config) {

    this.config = config;

    this.game = new PIXI.Application(this.config.canvas.width, this.config.canvas.height, { transparent: true, resolution: 1 })
    this.config.canvas.name.appendChild(this.game.view);

    this.container = new PIXI.Container();
    this.game.stage.addChild(this.container);

    this.cards = {
        front: [],
        back: PIXI.Texture.fromImage(this.config.icons.cover.back),
        solved: PIXI.Texture.fromImage(this.config.icons.cover.checked),
        selected: []
    }

    this.populateWithCards = () => {
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

    this.populateWithCards();
    this.shuffleCards();

    this.cards.front.forEach((card, idx) => {
        let sprite = new PIXI.Sprite(card);

        sprite.anchor.set(0.5);
        sprite.anchor.set(0.5);
        sprite.x = (idx % this.config.icons.rows.x) * (this.config.icons.size.width + this.config.icons.size.marginX);
        sprite.y = Math.floor(idx / this.config.icons.rows.y) * (this.config.icons.size.height + this.config.icons.size.marginY);

        this.container.addChild(sprite);
    });

    setTimeout(() => {
        this.container.children.forEach((child, idx) => {
            child.interactive = true;
            child.buttonMode = true;

            child.texture = this.cards.back;
        })
    }, this.config.time.startAfter)


    this.container.x = (this.game.screen.width - this.container.width) / 2;
    this.container.y = (this.game.screen.height - this.container.height) / 2;

    this.timeout;
    this.matched = false;

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

    this.userClick = (child, idx) => {

        if (this.cards.selected.includes(child)) return;

        clearTimeout(this.timeout);

        if (this.matched) {
            this.checkIfMatch();
            this.matched = false;
        }

        if (this.cards.selected.length == 2) { this.noMatch(); }

        this.cards.selected.push(child);

        child.texture = this.cards.front[idx];

        if (this.cards.selected.length == 2) {
            if (this.cards.selected[0].texture == this.cards.selected[1].texture) {
                this.timeout = setTimeout(this.checkIfMatch, this.config.time.betweenCards);
                this.matched = true;
            }
            else {
                this.timeout = setTimeout(this.noMatch, this.config.time.betweenCards);
            }
        }
    }


    this.container.children.forEach((child, idx) => child.on('click', this.userClick.bind(false, child, idx)));
}