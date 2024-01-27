const width = 50;
const height = 200;
const maxVal = 10;

const vis = new BarGraphVisualizer(document.getElementById('visualizer-container'));
const currentAlgorithm = insertionSort;

async function shuffleArrayAnimated() {
    vis.deHighlightAll();
    let m = vis.length();

    while (m) {
        const i = Math.floor(Math.random() * m--);
        vis.highlight(i, "red");
        vis.highlight(m, "red");

        await vis.swap(i,m, 100);
        vis.deHighlight(i);
        vis.deHighlight(m);
    }
}



