const width = 50;
const height = 200;
const maxVal = 10;

const vis = new BarGraphVisualizer(document.getElementById('visualizer-container'), [[1,2,2,4,5,5,5,8,9,9], [0,0,0,0,0,0,0,0,0,0]]);

const currentAlgorithm = countingSort;
