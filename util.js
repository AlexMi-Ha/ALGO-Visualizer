async function shuffleArrayAnimated(array, seed) {
    {
        vis.clearLogs();
        vis.log("Shuffling...")
    }
    var m = array.length, t, i;

    while (m) {
        i = Math.floor(crandom(seed) * m--);
        {
            vis.select(i);
            vis.select(m);
            await vis.delay(10);
        }

        t = array[m];
        array[m] = array[i];
        array[i] = t;
        {
            vis.swap(i,m);
            await vis.delay(10);
            vis.deselect(i);
            vis.deselect(m);
            await vis.delay(10);            
        }
        ++seed
    }

    return array;
}

function crandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}