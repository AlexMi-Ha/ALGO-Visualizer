let A = [1,2,3,4,5,6,7,8,9,10];
let vis; 

const speedSlider = document.getElementById('speed-slider');
const seedElement = document.getElementById('shuffle-seed');

function setup() {
  createCanvas(400, 400);
  
  seedElement.value = floor(Math.random() * 1_000_000_000);

  vis = new BarGraphVisualizer(A);
}

function draw() {
  background(220);
  fill(0);
  vis.show();
}

function shuffleArray() {
  vis.resetAll();
  shuffleAnimated(A, seedElement.value);
}
