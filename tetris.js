const SHAPES = [
    // I
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    // J
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    // L
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    // O
    [
        [1, 1],
        [1, 1],
    ],
    // S
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    // T
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    // Z
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
];

const SHAPE_COLORS = [
    '#00BCD4',
    '#485FE5',
    '#FF9800',
    '#FFEB3B',
    '#4CAF50',
    '#A629BC',
    '#F44336',
];

const COLOR_SIDEBAR_BORDER = '#ddd';
const COLOR_EMPTY_BLOCK = '#343434';
const COLOR_GAME_OVERLAY = '#000000bb'
const COLOR_FONT = '#FFF';

const BLOCK_SIZE = 40;
const BLOCK_BACKGROUND = '#292929';

const GRAVITY_SPEED = 1;
const GRAVITY_ACCELERATION = 0.00001;
const GRAVITY_THRESHOLD = 1000; //After reaching this progress, the piece moves down

const GRID_COLS = 10;
const GRID_ROWS = 20;

const SIDEBAR_BORDER = 20;
const SIDEBAR_WIDTH_BLOCKS = 6;

const MAX_DT = 100; //Maximum Delta time in ms

const KEY_TO_INPUT_TYPE = {
    ArrowLeft: 'moveLEFT',
    ArrowRight: 'moveRight',
    ArrowDown: 'moveDown',
    ArrowUp: 'rotate',
    ' ': 'hardDrop',
    r: 'restart',
};

const GRID_WIDTH = GRID_COLS * BLOCK_SIZE;
const GRID_HEIGHT = GRID_ROWS * BLOCK_SIZE;

const SIDEBAR_WIDTH = SIDEBAR_WIDTH_BLOCKS * BLOCK_SIZE;
const SIDEBAR_CONTENT_X = GRID_WIDTH + SIDEBAR_BORDER + BLOCK_SIZE;
const SIDEBAR_CONTENT_Y = BLOCK_SIZE;

const CANVAS_WIDTH = GRID_WIDTH + SIDEBAR_BORDER + SIDEBAR_WIDTH;
const CANVAS_HEIGHT = GRID_HEIGHT;

const BLOCK_EMPTY = -1;

function initCanvas() {
    const canvas = document.getElementById('game');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.style.visibility = 'visible';

    console.log("Ja");
    return canvas.getContext('2d');
}

function makeEmptyGrid() {
    return Array.from({ length: GRID_ROWS }, () =>        
        Array(GRID_COLS).fill(BLOCK_EMPTY)
    );
}

function getRandomIndex(n) {
    return Math.floor(Math.random() * n);
}

function getRandomShapeID() {
    return getRandomIndex(SHAPES.length);
}

function createCurrentPiece(shapeId) {
    const shape = SHAPES[shapeId];

    return {
        shapeId,
        shape,
        position: {
            x: getRandomIndex(GRID_COLS - shape[0].length + 1), 
            y: 0,
        },
    };
}

function getInitialState() {
    const initialShapeID = getRandomShapeID();

    return {
        isGameOver: false,
        score: 0,
        gravity: {
            progress: 0,
            speed: GRAVITY_SPEED,
        },
        currentPiece: createCurrentPiece(initialShapeID),
        nextShapeId: getRandomShapeID(),
        grid: makeEmptyGrid(),
    };
}

function update(state, inputs, dt) {}

function drawBlock(ctx, color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

function drawShape(ctx, shape, colorId, x, y) {
    const color = SHAPE_COLORS[colorId];

    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
            if (shape[i][j]) {
                drawBlock(ctx, color, x + j * BLOCK_SIZE, y + i * BLOCK_SIZE);
            }
        }
    }
}

function render(ctx, state) {
    ctx.fillStyle = BLOCK_BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const {grid, currentPiece, nextShapeId } = state;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const colorId = grid[i][j];

            const color = 
                colorId === BLOCK_EMPTY ? COLOR_EMPTY_BLOCK : SHAPE_COLORS[shapeId];

            drawBlock(ctx, color, j * BLOCK_SIZE, i * BLOCK_SIZE);
        }
    }

    // console.log(currentPiece);
    drawShape(
        ctx,
        currentPiece.shape,
        currentPiece.shapeId,
        currentPiece.position.x * BLOCK_SIZE,
        currentPiece.position.y * BLOCK_SIZE,
    );

    drawShape(
        ctx, 
        SHAPES[nextShapeId], 
        nextShapeId, 
        SIDEBAR_CONTENT_X, 
        BLOCK_SIZE
    );

    ctx.fillStyle = COLOR_SIDEBAR_BORDER;
    ctx.fillRect(GRID_WIDTH, 0, SIDEBAR_BORDER, CANVAS_HEIGHT);

    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = COLOR_FONT;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText('Score:', SIDEBAR_CONTENT_X, SIDEBAR_CONTENT_Y + BLOCK_SIZE * 5);
    ctx.fillText(state.score, SIDEBAR_CONTENT_X, SIDEBAR_CONTENT_Y + BLOCK_SIZE * 6);
}

function main() {
    const ctx = initCanvas();
    const state = getInitialState();
    const inputs = {};

    let previousTime = performance.now();
    
    function loop(currentTime) {
        const dt = Math.min(currentTime - previousTime, MAX_DT);
        previousTime = currentTime;

        update(state, inputs, dt);
        render(ctx, state);

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    console.log(state);
}

main();



