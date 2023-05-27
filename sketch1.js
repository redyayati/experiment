class Complex {
  constructor(a, b){
    this.re = a 
    this.im = b
  }
  mult(c){
    const re = this.re * c.re - this.im * c.im ; 
    const im = this.re * c.im + this.im * c.re ;
    return new Complex(re , im) ;
  }
  add(c){
    this.re += c.re ;
    this.im += c.im ; 
  }
}


function dft(x) {
  let X = [];
  let N = x.length;
  for (let k = 0; k < N; k++) {
    let sum = new Complex(0,0);
    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI * k * n) / N;
      const c = new Complex(cos(phi) , -sin(phi))
      sum.add(x[n].mult(c)) ; 
    }
    sum.re = sum.re / N;
    sum.im = sum.im / N;
    freqcy = k;
    amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    thetaOff = atan2(sum.im, sum.re);
    X[k] = { re:sum.re, im:sum.im, freqcy, amp, thetaOff };
  }
  return X;
}

function epiCycles(x, y,rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freqcy = fourier[i].freqcy;
    let radius = fourier[i].amp;
    let thetaOff = fourier[i].thetaOff;
    x += radius * cos(freqcy * timePulse + thetaOff + rotation);
    y += radius * sin(freqcy * timePulse + thetaOff + rotation);
    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
    line(prevx, prevy, x, y);
  }
  return createVector(x,y) ;
}

const FOURIER = 1 ;
const USER = 0 ;
let timePulse = 0;
let wave = [];
let path = [];
let x = [];
let vx = 0;
let fourierX;
let state = -1 ;
drawing = [];

function mousePressed(){
  state = USER ;
  drawing = [] ;
  x = [];
  y = [];
  time = 0;
  path = [] ;
  
}
function mouseReleased(){
  state = FOURIER
  for (let i = 0 ; i < drawing.length ; i+=1){
    const c = new Complex(drawing[i].x , drawing[i].y);
    x.push(c);
  }
  fourierX = dft(x);
  fourierX.sort((a,b) => b.amp - a.amp);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  
  if (state == USER)  {
    let point = createVector(mouseX-width/2,mouseY-height/2) ;
    drawing.push(point);
    stroke(255);
    noFill();
    beginShape();
    for (let i=0;i<drawing.length;i++){
      vertex(drawing[i].x + width/2,drawing[i].y + height/2)
    }
    endShape();
    
  }
  else if (state == FOURIER){
    
  v = epiCycles(width/2,height/2,0, fourierX);
  
  path.unshift(v);

  beginShape();
  noFill();
  for (let i = 0 ; i < path.length ; i++){
    vertex(path[i].x , path[i].y) ;
  }
  
  endShape();

  dt = TWO_PI / fourierX.length;
  timePulse += dt;
  if (timePulse > TWO_PI){
    path = [];
    timePulse = 0 ;
  }
}
}
