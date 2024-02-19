
async function shuffleArrayAnimated(indexOfGraph = 0) {
    vis.deHighlightAll(indexOfGraph);
    let m = vis.length(indexOfGraph);

    while (m) {
        const i = Math.floor(Math.random() * m--);
        vis.highlight(i, "red", indexOfGraph);
        vis.highlight(m, "red", indexOfGraph);
        await vis.swap(i,m, indexOfGraph, indexOfGraph, 100);
        vis.deHighlight(i, indexOfGraph);
        vis.deHighlight(m, indexOfGraph);
    }
}