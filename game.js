const canvas = document.getElementById('maincanvas');
const ctx = canvas.getContext('2d');

let CANVAS_WIDTH = canvas.width = window.innerWidth;
let CANVAS_HEIGHT = canvas.height = window.innerHeight;

const img = new Image();
img.src = "GHost.png";

var keys = [];

let x = 0;
let y = 0;
let ofsx = 0;
let ofsy = 0;

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
            ofsy += 10;
        }
    }
    if (87 in keys)
    {
        if (keys[87])
        {
            ofsy -= 10;
        }
    }
    if (68 in keys)
    {
        if (keys[68])
        {
            ofsx += 10;
        }
    }
    if (65 in keys)
    {
        if (keys[65])
        {
            ofsx -= 10;
        }
    }
}

document.addEventListener('keydown', function(event) {
    keys[event.keyCode] = true;
    console.log(event.keyCode);
    checkKeys();
    
});
document.addEventListener('keyup', function(event) {
    keys[event.keyCode] = false;
    
});
let myPopup = new Popup(CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2-100, 300, 200, 'This is my test site made\nwith canvas and js.');

window.addEventListener('resize', function(event) {
    CANVAS_WIDTH = canvas.width = window.innerWidth;
    CANVAS_HEIGHT = canvas.height = window.innerHeight;
    myPopup = new Popup(CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2-100, 300, 200, 'This is my test site made\nwith canvas and js.');
}, true);
const button1 = new RoundedButton(50, 50, 50, 50, 5, '?', 'white', () => {
    myPopup.show();
});
function DrawFrame()
{
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(img, x+ofsx, y+ofsy, 300, 300);
    button1.draw();
    myPopup.draw();
    requestAnimationFrame(DrawFrame);
}
DrawFrame();

