let A = [1,2,3,4,5,6,7,8,9,10];
let vis; 

const speedSlider = document.getElementById('speed-slider');
const seedElement = document.getElementById('shuffle-seed');

function setup() {
  createCanvas(400, 400);
  
  seedElement.value = floor(Math.random() * 1_000_000_000);

  //vis = new BarGraphVisualizer(A, new LogContainer());
  //vis = new GraphVisualizer(new LogContainer());
  vis = new BinaryTreeVisualizer(new LogContainer());
  A = shuffle(A);
  vis.constructBinaryHeapLike(A);
  heapSort(A);
}

function draw() {
  background(220);
  fill(0);
  vis.show();
}

function LogContainer() {
  this.logContainer = document.getElementById('log-container');

  this.log = function(text) {
    let message = document.createElement('p');
    message.classList.add('log');
    message.innerText = text;
    
    this.logHtmlElement(message);
  }
  this.logError = function(text) {
    let message = document.createElement('p');
    message.classList.add('log');
    message.classList.add('error');
    message.innerText = text;
    this.logHtmlElement(message);
    
  }

  this.clear = function() {
    this.logContainer.innerHTML = '';
  }

  this.logHtmlElement = function(ele) {
    this.logContainer.appendChild(ele);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }
}

function shuffleArray() {
  vis.resetAll();
  shuffleArrayAnimated(A, seedElement.value);
}
