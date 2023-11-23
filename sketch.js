let A = [1,2,3,4,5,6,7,8,9,10];
let vis; 

const speedSlider = document.getElementById('speed-slider');

function setup() {
  createCanvas(400, 400);
  vis = new BarGraphVisualizer(A);
}

function draw() {
  background(220);
  fill(0);
  vis.show();
}

function shuffleArray() {
  A = shuffle(A);
  vis.updateArr(A);
}
