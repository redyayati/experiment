
function setup() {
  createCanvas(800,800);
  print("Hello");
  background(220);
}

function draw() {
  // background(220);
  if (mouseIsPressed == true){
    background(220);
  }
  
  stroke(250,50,50,10);
  strokeWeight(10);
  fill(0,220,2,20);
  ellipse(mouseX,mouseY,50);
  
}
