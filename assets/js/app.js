let width = 600;
let height = 600;
let gridSize = 15;
let grid = [];
let nextGrid = [];
let hue = 0;
let cursorSize = 5;
let flush = false;
let canvas;

function setup() {
    // calculate width and height of canvas
    let w = window.innerWidth;
    let h = window.innerHeight;

    // device width and height with grid size without reminder, so the grid count is always in integer
    width = Math.floor(w / gridSize) * gridSize;
    height = Math.floor(h / gridSize) * gridSize;

    canvas = createCanvas(width, height);
    canvas.style("border", "1px solid #000");

    grid = generateGrid(width, height, gridSize);

    strokeWeight(0);
    colorMode(HSB);

    frameRate(60);
    // frameRate(10);
}

function draw() {
    background("#202124");

    (hue > 360) ? hue = 0 : hue = hue + 1;

    displayGrid();

    generateNext();
}

function generateGrid(width, height, gridSize) {
    let toReturn = [];
    // loop over the width and height and create a grid
    for (let y = 0; y < height; y += gridSize) {
        let row = [];
        for (let x = 0; x < width; x += gridSize) {
            row.push(0);
        }
        toReturn.push(row);
    }

    return toReturn;
}

function displayGrid() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] !== 0) {
                fill(grid[y][x], 255, 255);
                rect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }
}

function mouseDragged() {
    // detect if, the mouse pointer is inside the canvas
    // get canvas bounds
    let canvasBounds = canvas.canvas.getBoundingClientRect();
    let canvasX = canvasBounds.x;
    let canvasY = canvasBounds.y;

    // check if mouse pointer is inside canvas
    if (mouseX < canvasX || mouseY < canvasY) {
        return;
    }

    // detect the mouse pointer grid
    let x = Math.floor((mouseX - canvasX) / gridSize);
    let y = Math.floor((mouseY - canvasY) / gridSize);

    for (let i = y - cursorSize; i < y + cursorSize; i++) {
        for (let j = x - cursorSize; j < x + cursorSize; j++) {
            if (grid[i] && grid[i][j] !== undefined) {
                let chance = 0.5;
                if (Math.random() < chance) {
                    grid[i][j] = hue;
                }
            }
        }
    }
}

function generateNext() {
    nextGrid = generateGrid(width, height, gridSize);
    let everythingIsZero = true;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            // check if y+1 is 0, if so, add 1 to count
            if (grid[y][x] !== 0) {
                everythingIsZero = false;

                if (flush && y === grid.length - 1) {
                    nextGrid[y][x] = 0;
                    continue;
                }

                if (grid[y + 1] && grid[y + 1][x] === 0) {
                    nextGrid[y + 1][x] = grid[y][x];
                    continue;
                }

                // choose right or left
                let direction = Math.round(Math.random()) === 0 ? -1 : 1;
                if (grid[y + 1] && grid[y + 1][x + direction] === 0) {
                    nextGrid[y + 1][x + direction] = grid[y][x];
                    continue;
                }

                if (grid[y + 1] && grid[y + 1][x - direction] === 0) {
                    nextGrid[y + 1][x - direction] = grid[y][x];
                    continue;
                }

                nextGrid[y][x] = grid[y][x];
            }
        }
    }

    if (everythingIsZero) {
        flush = false;
    }

    grid = nextGrid;
}

function flushIt() {
    flush = true;

    // play sound
    let audio = new Audio('assets/flush.mp3');
    audio.volume = 0.2;
    audio.play();
}
