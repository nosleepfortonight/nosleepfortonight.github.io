const canvas = document.getElementById('maincanvas');
const ctx = canvas.getContext('2d');

let CANVAS_WIDTH = canvas.width = window.innerWidth;
let CANVAS_HEIGHT = canvas.height = window.innerHeight;

const img = new Image();
img.src = "GHost.png";

let blocks = [];
let blocktype = "arrow";
var keys = [];

let x = 0;
let y = 0;
let cameraX = 0;
let cameraY = 0;
const myButton = {
    x: 100, // X-coordinate of the button's top-left corner
    y: 200, // Y-coordinate of the button's top-left corner
    width: 150, // Width of the button
    height: 50, // Height of the button
    color: 'blue', // Background color of the button
    text: 'MAMA', // Text displayed on the button
    stroke: 'black'
};
function drawRoundedRect(x, y, width, height, cornerRadius, color) {
    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + width - cornerRadius, y);
    ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
    ctx.lineTo(x + width, y + height - cornerRadius);
    ctx.arcTo(x + width, y + height, x + width - cornerRadius, y + height, cornerRadius);
    ctx.lineTo(x + cornerRadius, y + height);
    ctx.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius);
    ctx.lineTo(x, y + cornerRadius);
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
    ctx.closePath();
    
    // You can set the fill or stroke style as per your requirement
    ctx.fillStyle = color;
    ctx.fill();
    
    // You can also stroke the rounded rectangle outline if needed
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

class RoundedButton {
    constructor(x, y, width, height, cornerRadius, text, color, clickCallback) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.cornerRadius = cornerRadius;
        this.text = text;
        this.clickCallback = clickCallback;
        this.color = color

        canvas.addEventListener('click', this.handleClick.bind(this));
    }

    draw() {
        drawRoundedRect(this.x, this.y, this.width, this.height, this.cornerRadius, this.color);

        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        const textWidth = ctx.measureText(this.text).width;
        const textX = this.x + (this.width - textWidth) / 2;
        const textY = this.y + this.height / 2 + 10;

        ctx.fillText(this.text, textX, textY);
    }

    handleClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        ) {
            if (this.clickCallback) {
                this.clickCallback();
            }
        }
    }
}
class ImageRoundedButton {
    constructor(x, y, width, height, cornerRadius, image, clickCallback) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.cornerRadius = cornerRadius;
        this.image = image;
        this.clickCallback = clickCallback;

        canvas.addEventListener('click', this.handleClick.bind(this));
    }

    draw() {
        drawRoundedRect(this.x, this.y, this.width, this.height, this.cornerRadius, 'white');

        const imgX = this.x + (this.width - this.image.width) / 2;
        const imgY = this.y + (this.height - this.image.height) / 2;

        ctx.drawImage(this.image, imgX, imgY);
    }

    handleClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        ) {
            if (this.clickCallback) {
                this.clickCallback();
            }
        }
    }
}

class Popup {
    constructor(x, y, width, height, content) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.content = content;
        this.visible = false;
        this.close_button = new RoundedButton(this.x + this.width - 30, this.y + 5, 25, 25, 5, 'X', 'red', () => {
            this.hide();
        });
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    draw() {
        if (this.visible) {
            // Draw a semi-transparent background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the popup
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            // Draw the content as multiple lines
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            const lines = this.content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                ctx.fillText(line, this.x + 10, this.y + 50 + i * 20);
            }
            
            this.close_button.draw();
        }
    }

    handleMouseClick(x, y) {
        if (this.visible) {
            this.close_button.handleClick(x, y);
        }
    }
}

function checkKeys()
{
    if (83 in keys)
    {
        if (keys[83])
        {
            cameraY -= 10;
        }
    }
    if (87 in keys)
    {
        if (keys[87])
        {
            cameraY += 10;
        }
    }
    if (68 in keys)
    {
        if (keys[68])
        {
            cameraX -= 10;
        }
    }
    if (65 in keys)
    {
        if (keys[65])
        {
            cameraX += 10;
        }
    }
}
class Block {
    constructor(image, x, y) {
        this.id = Math.random().toString(36).substr(2, 9); // Generate a unique ID for each block
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
    }

    drawBlock() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Add a click event listener to the canvas
canvas.addEventListener('click', handleCanvasClick);

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Iterate through the blocks and check which block was clicked
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];

        if (
            mouseX >= block.x &&
            mouseX <= block.x + block.width &&
            mouseY >= block.y &&
            mouseY <= block.y + block.height
        ) {
            // Remove the clicked block from the array based on its ID
            blocks.splice(i, 1);
            break; // Exit the loop after removing the block
        }
    }
}

    
function drawGrid(cellSize, canvasWidth, canvasHeight) {
    ctx.strokeStyle = 'gray'; // Set the color of the grid lines

    // Draw vertical lines
    for (let x = 0; x <= canvasWidth; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvasHeight; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}
const cellSize = 50;
document.addEventListener('keydown', function(event) {
    keys[event.keyCode] = true;
    console.log(event.keyCode);
    checkKeys();
    
});
document.addEventListener('keyup', function(event) {
    keys[event.keyCode] = false;
    
});
let myPopup = new Popup(CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2-100, 300, 200, 'Это моя тестовая игруля на JS.');

window.addEventListener('resize', function(event) {
    CANVAS_WIDTH = canvas.width = window.innerWidth;
    CANVAS_HEIGHT = canvas.height = window.innerHeight;
    myPopup = new Popup(CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2-100, 300, 200, 'Это моя тестовая игруля на JS.');
}, true);
let inactive_arrow = new Image();
inactive_arrow.src = 'inactive-arrow.png';
const button1 = new RoundedButton(25, 25, 50, 50, 5, '?', 'white', () => {
    myPopup.show();
});
arrow_btn = new ImageRoundedButton(125, 25, 50, 50, 5, inactive_arrow, () => {
    blocktype = "arrow";
    console.log(blocktype);
})

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - cameraX; // Adjust for camera position
    const mouseY = event.clientY - rect.top - cameraY ; // Adjust for camera position
    console.log('MouseX:', mouseX, 'MouseY:', mouseY);
    let blockRemoved = false;

    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];

        if (
            mouseX >= block.x &&
            mouseX <= block.x + block.width &&
            mouseY >= block.y &&
            mouseY <= block.y + block.height
        ) {
            // Remove the clicked block from the array based on its ID
            blocks.splice(i, 1);
            blockRemoved = true;
            break; // Exit the loop after removing the block
        }
    }

    if (!blockRemoved) {
        // If no block was removed, add a new block
    
        // Calculate the row and column of the clicked cell
        const clickedCellX = Math.floor(mouseX / cellSize);
        const clickedCellY = Math.floor(mouseY / cellSize);
    
        // Calculate the exact position within the game world, including camera offset
        const cellX = clickedCellX * cellSize;
        const cellY = clickedCellY * cellSize;
    
        blocks.push(new Block(inactive_arrow, cellX, cellY));
    }
    
}



function drawGameWorld() {

    blocks.forEach(block => {
        block.drawBlock();
    });
    drawGrid(50, 10000, 10000);
}
function drawUI() {
    // Draw your UI elements here, such as buttons, popups, or any other UI components.
    button1.draw();
    arrow_btn.draw();
    myPopup.draw();
    // Other UI elements go here.
}


function DrawFrame() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw the game world (blocks and other game objects)

    // Draw the UI elements (buttons)
    
    
    ctx.translate(cameraX, cameraY);
    drawGameWorld();

    // Translate the rendering context based on the camera position





    // Restore the rendering context to its original state
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawUI();
    requestAnimationFrame(DrawFrame);
}

DrawFrame();
