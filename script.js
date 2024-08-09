let serial;
let portName = 'COM5'; // Modify to your serial port name
let sensorValues = [];
let bufferSize = 500;
let isRunning = true;
let isReset = false;
let maxX = 1000;
let minX = 0;
let maxY = 1023;
let minY = 0;
let graphWidth = 700;
let graphHeight = 500;
let buttonWidth = 120;
let buttonHeight = 40;
let buttonStartX = 750;
let buttonStartY = 20;
let buttonResetX = 750;
let buttonResetY = 70;
let currentValueX = 750;
let currentValueY = 120;

let startButtonHovered = false;
let resetButtonHovered = false;

function setup() {
    createCanvas(900, 600);
    serial = new p5.SerialPort();
    serial.list();
    serial.open(portName);
    serial.on('data', serialEvent);
}

function draw() {
    background(255);
    
    drawGraph();
    drawGrid();
    drawAxes();
    
    checkButtonHover();
    drawButton(buttonStartX, buttonStartY, "Start/Stop", startButtonHovered);
    drawButton(buttonResetX, buttonResetY, "Reset", resetButtonHovered);
    drawCurrentValueBox();
    
    if (isRunning && !isReset) {
        // Serial data handling is done in serialEvent
    }
    
    if (isReset) {
        sensorValues = [];
        isReset = false;
    }
}

function drawGraph() {
    noFill();
    stroke(0);
    beginShape();
    for (let i = 0; i < sensorValues.length; i++) {
        let x = map(i, 0, sensorValues.length, 50, graphWidth + 50);
        let y = map(sensorValues[i], minY, maxY, graphHeight, 0);
        vertex(x, y);
    }
    endShape();
}

function drawGrid() {
    stroke(200);
    strokeWeight(1);
    for (let i = 50; i <= maxX; i += 50) {
        let x = map(i, 0, maxX, 50, graphWidth + 50);
        line(x, 0, x, graphHeight);
    }
    for (let i = 0; i <= maxY; i += 50) {
        let y = map(i, minY, maxY, graphHeight, 0);
        line(50, y, graphWidth + 50, y);
    }
}

function drawAxes() {
    stroke(0);
    strokeWeight(2);
    line(50, 0, 50, graphHeight); // Y axis
    line(50, graphHeight, graphWidth + 50, graphHeight); // X axis
    
    for (let i = 50; i <= maxX; i += 50) {
        let x = map(i, 0, maxX, 50, graphWidth + 50);
        textAlign(CENTER);
        text(i, x, graphHeight + 20);
    }
    
    for (let i = 0; i <= maxY; i += 50) {
        let y = map(i, minY, maxY, graphHeight, 0);
        textAlign(RIGHT);
        text(i, 45, y);
    }
}

function drawButton(x, y, label, isHovered) {
    fill(isHovered ? color(180, 180, 255) : color(200)); // Change color on hover
    stroke(0);
    rect(x, y, buttonWidth, buttonHeight, 10); // Rounded corners
    
    fill(0);
    textAlign(CENTER, CENTER);
    text(label, x + buttonWidth / 2, y + buttonHeight / 2);
}

function drawCurrentValueBox() {
    fill(255);
    stroke(0);
    rect(currentValueX, currentValueY, buttonWidth, buttonHeight, 10); // Rounded corners
    fill(0);
    textAlign(CENTER, CENTER);
    let currentValue = (sensorValues.length > 0) ? str(sensorValues[sensorValues.length - 1]) : "N/A";
    text("Current Value: " + currentValue, currentValueX + buttonWidth / 2, currentValueY + buttonHeight / 2);
}

function checkButtonHover() {
    startButtonHovered = mouseX > buttonStartX && mouseX < buttonStartX + buttonWidth &&
                          mouseY > buttonStartY && mouseY < buttonStartY + buttonHeight;
    resetButtonHovered = mouseX > buttonResetX && mouseX < buttonResetX + buttonWidth &&
                         mouseY > buttonResetY && mouseY < buttonResetY + buttonHeight;
}

function mousePressed() {
    if (startButtonHovered) {
        isRunning = !isRunning; // Toggle start/stop
    }
    
    if (resetButtonHovered) {
        isReset = true; // Reset data
    }
}

function serialEvent() {
    let input = serial.readLine().trim();
    if (input) {
        let value = parseFloat(input);
        sensorValues.push(value);
        if (sensorValues.length > bufferSize) {
            sensorValues.shift();
        }
    }
}
