let canvasWidth = 600;
let canvasHeight = 1000;
let interval;

let k = 10;
let positionY = 100;
let ballMass = 10;
let velocityY = 0;
let gravity = 10;
let timeUpdate = 0.03; //the amount of time that elapses between each drawing (in seconds)
let anchorY = 200;      //natural length of the spring
let damping = 0;

let canvasArea = {
    canvas: document.createElement("canvas"),
    start(){
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        this.canvas.style.float = "left";
        document.body.insertAdjacentElement("beforeend", this.canvas);
    },
    clear(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//executes when the page loads
//calls dragElement, which allows the user to move the moveable line
//creates the canvas and uses setInterval to repeatedly call the update function
function playSim() {
    dragElement(document.getElementById("moveableLine"));
    canvasArea.start();
    interval = setInterval(update);
}

//executes when the pause button is pressed
//clears the interval, pausing the simulation
function pause(){
    clearInterval(interval);
}

//executes when the play button is pressed
//clears the interval and then executes playSim()
function play(){
    clearInterval(interval);
    playSim();
}

//executes when the simulation begins
//allows the user to move the moveable line 
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      //get the mouse cursor position at startup
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      //call a function whenever the cursor moves
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      //calculate the new cursor position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      //set the element's new position
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      //stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

//executed repeatedly by setInterval
function update(){

    //UPDATE THE VARIABLES

    //update spring constant
    let kSlider = document.getElementById("kSliderRange");
    let kInput = document.getElementById("kInput");

    //if the user changes the input value, the value of k and the slider change with it
    if (k != kInput.value){
        k = kInput.value;
        kSlider.value = sliderChange(kInput.value);
    }

    //if the user changes the slider value, the value of k and the input change with it
    else if (k != kSlider.value){
        k = kSlider.value;
        kInput.value = inputChange(kSlider.value);
    }

    //update mass
    let massSlider = document.getElementById("massSliderRange");
    let massInput = document.getElementById("massInput");

    if (ballMass != massInput.value){
        ballMass = massInput.value;
        massSlider.value = sliderChange(massInput.value);
    }

    else if (ballMass != massSlider.value){
        ballMass = massSlider.value;
        massInput.value = inputChange(massSlider.value);
    }

    //update gravity
    let gravitySlider = document.getElementById("gravitySliderRange");
    let gravityInput = document.getElementById("gravityInput");
    
    if (gravity != gravityInput.value){
        gravity = gravityInput.value;
        gravitySlider.value = sliderChange(gravityInput.value);
    }

    else if (gravity != gravitySlider.value){
        gravity = gravitySlider.value;
        gravityInput.value = inputChange(gravitySlider.value);
    }
    
    //update damping
    let dampingSlider = document.getElementById("dampingSliderRange");
    let dampingInput = document.getElementById("dampingInput");
    
    if (damping != dampingInput.value){
        damping = dampingInput.value;
        dampingSlider.value = sliderChange(dampingInput.value)
    }

    else if (damping != dampingSlider.value){
        damping = dampingSlider.value;
        dampingInput.value = inputChange(dampingSlider.value)
    }

    //update timeUpdate (the amount of time that elapses between each draw)
    timeUpdate = document.getElementById("animationSlider").value;

    //clear the canvas and call the draw function
    canvasArea.clear();
    draw();

    //CALCULATIONS
    //performs a series of calculations in order to find the position of the ball
    //determines the sum of the forces acting on the ball (only forces in the Y axis because the spring is vertical)
    //these forces include the force of gravity, the damping force and the spring force
    //Newton's second law, a = F/m, is used to determine the acceleration of the ball
    //finally, kinematics equations are used to solve for the velocity and then position of the ball

    let springForceY = -k*(positionY - anchorY);                        //Hooke's Law: Fs = -kx
    let dampingForce = damping * velocityY;                             //damping units: kg/s
    let forceY = springForceY + ballMass * gravity - dampingForce;      //sum of the forces in the Y axis

    let accelerationY = forceY/ballMass;                                //Newton's second law: a = F/m
    velocityY = velocityY + accelerationY * timeUpdate;                 //Kinematics equation: v = vinitial + at
    positionY = positionY + velocityY * timeUpdate;                     //Kinematics equation: x = xinitial + vt

    //DISPLAY
    //values are rounded to two decimal places
    let accelerationOutput = document.getElementById("accelerationOutput");
    accelerationOutput.innerHTML = accelerationY.toFixed(2);

    let velocityOutput = document.getElementById("velocityOutput");
    velocityOutput.innerHTML = velocityY.toFixed(2);

    let period = 2 * Math.PI * Math.sqrt(ballMass/k);
    let periodOutput = document.getElementById("periodOutput");
    periodOutput.innerHTML = period.toFixed(2);

}

//executes when the user changes the input of a variable
//if the enter key is pressed, the interval is cleared and the simulation starts again
function readInput(event){
    let x = event.keyCode;
    if (x == 13){
        clearInterval(interval);
        playSim();
    }
}

//executes when the user changes the input value
//the interval is cleared and the velocity and position are reset
function sliderChange(inputValue){
    clearInterval(interval); //stops calling update to allow the input to be changed
    positionY = 100;
    velocityY = 0;
    return inputValue;
}

//executes when the user changes the slider value
//the position and velocity are reset
function inputChange(sliderValue){
    positionY = 100;
    velocityY = 0;
    return sliderValue;
}

//is executed by the update function
//draws the spring and the ball
function draw(){

    //DRAWS THE BALL
    let ctx = canvasArea.context;
    ctx.strokeStyle = "#77B1D6";
    ctx.beginPath();
    ctx.arc(300, positionY, 30, 0, 2 * Math.PI);
    ctx.stroke();

    //DRAWS THE SPRING
    var startX = 300;
    var startY = 0;

    //zigzagSpacing is the distance from the tip to bottom of a zigzag
    //6 is the number of complete lines in the zigzag
    var zigzagSpacing = (positionY-30)/6;   
    var zigzagHeight = 50;                  

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    for (var n = 0; n < 7; n++) {
        var y = startY - zigzagSpacing/2 + ((n + 1) * zigzagSpacing);
        var x;

        //if drawing the first line, it is shorter because it starts from half the zigzagHeight
        if (n==0){
            x = startX + zigzagHeight/2;
            y = startY + zigzagSpacing/2;
        }

        //if drawing the last line, it is shorter because it ends at a height of half the zigzagHeight
        else if (n==6){
            x = startX;
            y -= zigzagSpacing/2;
        }
            
        // if n is even...
        else if (n % 2 == 0) { 
            x = startX + zigzagHeight/2;
        }

        // if n is odd...
        else { 
            x = startX - zigzagHeight/2;
        }
        ctx.lineTo(x, y);
    }
    
    ctx.stroke();

}
