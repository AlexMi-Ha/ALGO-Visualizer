
async function shuffleLinearArrayAnimated(indexOfGraph = 0) {
    await _shuffleAnimated(
        (i) => vis.highlight(i, 'red', indexOfGraph),
        (i) => vis.deHighlight(i, indexOfGraph),
        (i,j) => vis.swap(i,j,indexOfGraph, indexOfGraph, 100),
        () => vis.length(indexOfGraph),
        () => vis.deHighlightAll(indexOfGraph)
    );
}

async function _shuffleAnimated(highlightFunction, deHighlightFunction, swapFunction, lengthFunction, deHighlightAllFunction) {
    vis.log("Shuffling...");
    deHighlightAllFunction();
    let m = lengthFunction();

    while (m) {
        const i = Math.floor(Math.random() * m--);
        highlightFunction(i);
        highlightFunction(m);
        await swapFunction(i,m);
        deHighlightFunction(i);
        deHighlightFunction(m);
    }
    vis.clearLog();
}