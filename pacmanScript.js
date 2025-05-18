const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lightGreen = "#8df542";
let lightBlue = "#00f7ff";
let lightRed = "#ff6e70";
let lightMagenta = "#f06eff";
let lightYellow = "#f2f55d";
let white = "#ffffff";
let maxCols = 27;
let maxRows = 12;
let foodCount = 0;
const walls = [];
const foods = [];

class BoxCollider2D {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    isColliding(other) {
        const condition1 = this.x < (other.x + other.size);
        const condition2 = (this.x + this.size) > other.x
        const condition3 = this.y < (other.y + other.size);
        const condition4 = (this.y + this.size) > other.y;

        return (condition1 && condition2 && condition3 && condition4);
    }
}

class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.direction = 1;
        this.speedx = 0;
        this.speedy = 0;
        this.canMove = true;
        this.canTurn = true;
        this.currentTile = [0, 0];
        this.collider = new BoxCollider2D(x, y, size);
    }
}

class Wall {
    constructor(x, y, size, id) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.id = id;
        this.collider = new BoxCollider2D(x , y, size);
    }
}

class Food {
    constructor(x, y, size, id) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.id = id;
        this.collider = new BoxCollider2D(x , y, size);
    }
}

const player = new Player(654, 240, 48);
const enemy1 = new Player(654, 384, 48);
const enemy2 = new Player(558, 384, 48);
const enemy3 = new Player(750, 384, 48);

const controls = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false
};

// y = 12 | 720 : x = 27 | 1296
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 2, 2, 2, 0, 2, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 1],
  [1, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 2, 2, 0, 2, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 1, 1, 0, 2, 0, 2, 0, 0, 1],
  [1, 0, 1, 2, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 2, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 0, 2, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]
;

function update() {
    player.collider.update(player.x, player.y);
    enemy1.collider.update(enemy1.x, enemy1.y);
    enemy2.collider.update(enemy2.x, enemy2.y);
    enemy3.collider.update(enemy3.x, enemy3.y);
    
    foods.forEach(food => {
        food.collider.update(food.x, food.y);
    });
}

function checkPlayerPos() {
    let posx = 30;
    let posy = 0;
    let size = 48;

    for (let i = 0; i < maxRows; i++) {
        for (let j = 0; j < maxCols; j++) {
            if (player.x == posx && player.y == posy) {
                player.currentTile[0] = posx;
                player.currentTile[1] = posy;
            }
            posx += size;
        }
        posx = 30;
        posy += size;
    }
}

function playerMovementReset() {
    player.canMove = false;
    player.direction = 1;
    player.speedx = 0;
    player.speedy = 0;
    player.x = player.currentTile[0];
    player.y = player.currentTile[1];
}

function playerMovement() {
    let speed = 4;

    player.canMove = true;

    walls.forEach(wall => {
        if (player.collider.isColliding(wall.collider))
            playerMovementReset();
    });

    foods.forEach(food => {
        if (player.collider.isColliding(food.collider)) {
            foodCount--;
            food.x = -50;
            food.y = -50;
        }
    });

    if ((player.x - 30) % 48 == 0 && player.y % 48 == 0)
        player.canTurn = true;
    else 
        player.canTurn = false;

    if (player.canMove) {
        if (controls.KeyW && player.direction != 180 && player.canTurn) {
            player.direction = 0;
            player.speedy = -speed;
            player.speedx = 0;
        }
        else if (controls.KeyS && player.direction != 0 && player.canTurn) {
            player.direction = 180;
            player.speedy = speed;
            player.speedx = 0;
        }
        else if (controls.KeyA && player.direction != 90 && player.canTurn) {
            player.direction = 270;
            player.speedx = -speed;
            player.speedy = 0;
        }
        else if (controls.KeyD && player.direction != 270 && player.canTurn) {
            player.direction = 90;
            player.speedx = speed;
            player.speedy = 0;
        }
        
        player.x += player.speedx;
        player.y += player.speedy;
    }
    
}

function createWallsAndFoods() {
    let posx = 30;
    let posy = 0;
    let size = 48;
    let wallId = 0;
    let foodId = 0;

    for (let i = 0; i < maxRows; i++) {
        for (let j = 0; j < maxCols; j++) {
            if (map[i][j] == 1) {
                const tempWall = new Wall(posx, posy, size, wallId);
                walls.push(tempWall);
                wallId++;
            }
            if (map[i][j] == 2) {
                const tempFood = new Food(posx, posy, size, foodId);
                foods.push(tempFood);
                foodId++;
                foodCount++;
            }
            posx += size;
        }
        posx = 30;
        posy += size;
    }
}

function drawPlayers() {
    context.fillStyle = lightBlue;
    context.fillRect(player.x, player.y, player.size, player.size);
    context.fillStyle = lightRed;
    context.fillRect(enemy1.x, enemy1.y, enemy1.size, enemy1.size);
    context.fillStyle = lightRed;
    context.fillRect(enemy2.x, enemy2.y, enemy2.size, enemy2.size);
    context.fillStyle = lightRed;
    context.fillRect(enemy3.x, enemy3.y, enemy3.size, enemy3.size);
}

function drawWallsAndFoods() {
    walls.forEach(wall => {
        context.fillStyle = lightGreen;
        context.fillRect(wall.x, wall.y, wall.size, wall.size);
    });
    foods.forEach(food => {
        context.fillStyle = lightYellow;
        context.fillRect(food.x+20, food.y+20, food.size/6, food.size/6);
    })
}

function drawObjects() {
    drawPlayers();
    drawWallsAndFoods();
}

window.addEventListener("keydown", (event) => {
    controls[event.code] = true;
})

window.addEventListener("keyup", (event) =>{
    controls[event.code] = false;
})

function displayText(color, text, font, posx, posy,) {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, posx, posy);
}

function updateScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    checkPlayerPos();
    playerMovement();
    drawObjects();
    update()
    displayText(white, "Food to collect: " + foodCount, "30px Arial", 78, 34);
    requestAnimationFrame(updateScreen);
}

createWallsAndFoods();
updateScreen();
