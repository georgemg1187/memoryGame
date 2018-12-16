let gameContainer = document.getElementById('game-canvas');
let app = new PIXI.Application(1280, 720, { transparent: true, resolution: 1 });

gameContainer.appendChild(app.view);

let container = new PIXI.Container();
app.stage.addChild(container);


let frontNo = 50;
let assetsPreffix = 'images/front/icon'
let assetsSuffix = '.png'
let frontList = [];

for (let i = 1; i <= frontNo; i++) {
    frontList.push(PIXI.Texture.fromImage(assetsPreffix + i + assetsSuffix));
}

frontList = frontList.map(item => [item, item]).flat();

function shuffle(arr) {
    var temp = [...arr];

    arr = arr.map((item) => item = temp.splice(Math.floor(Math.random() * temp.length), 1));

    return arr.flat();
}

let backNo = 100;
let backCover = PIXI.Texture.fromImage('images/back/back.jpg');
let checked = PIXI.Texture.fromImage('images/checked/checked.jpg');

let cardWidth = 64;
let marginErrorX = 20;
let marginErrorY = 4;

let selectedCards = [];

for (let i = 0; i < backNo; i++) {
    var sprite = new PIXI.Sprite(backCover)

    sprite.interactive = true;
    sprite.button = true;

    sprite.anchor.set(0.5);
    sprite.anchor.set(0.5);
    sprite.x = (i % 10) * (cardWidth + marginErrorX);
    sprite.y = Math.floor(i / 10) * (cardWidth + marginErrorY);

    container.addChild(sprite);
}

container.x = (app.screen.width - container.width) / 2;
container.y = (app.screen.height - container.height) / 2;

container.children.forEach((child, idx) => {
    child.on('click', match.bind({}, child, idx))
})


function match(child, idx) {

    var timeout;

    clearTimeout(timeout);

    selectedCards.push(child);

    child.texture = frontList[idx];

    if (selectedCards.length == 2) {
        if (selectedCards[0].texture == selectedCards[1].texture) {

            timeout = setTimeout(() => {
                selectedCards.forEach(card => {
                    card.texture = checked;
                    card.removeAllListeners();
                });
                selectedCards = [];
            }, 500)

        }
        else {
            timeout = setTimeout(() => {
                selectedCards.forEach((card) => {
                    card.texture = backCover;
                })
                selectedCards = [];
            }, 500)
        }
    }
    // console.log(selectedCards, child)
}



// for (var i = 0; i < 100; i++) {
//     var bunny = new PIXI.Sprite(backCover);
//     bunny.anchor.set(0.5);
//     bunny.x = (i % 10) * 84;
//     bunny.y = Math.floor(i / 10) * 70;
//     container.addChild(bunny);
// }

// Center on the screen











// var firstSprite = PIXI.Texture.fromImage('images/front/icon1.png');
// var secondSprite = PIXI.Texture.fromImage('images/front/icon2.png');

// var sprite = new PIXI.Sprite(firstSprite);
// // Set the initial position
// // sprite.anchor.set(0.5);
// // sprite.x = app.screen.width / 2;
// // sprite.y = app.screen.height / 2;

// // Opt-in to interactivity
// sprite.interactive = true;

// // Shows hand cursor
// sprite.buttonMode = true;

// // Pointers normalize touch and mouse
// sprite.on('pointerdown', onClick);


// app.stage.addChild(sprite);

// function onClick () {
//     sprite.texture = secondSprite;
// }