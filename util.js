async function shuffleArrayAnimated(array, seed) {
    {
        vis.clearLogs();
        vis.log("Shuffling...")
    }
    var m = array.length, t, i;
    var rng = new Random(seed);

    while (m) {
        i = Math.floor(rng.nextSeededRandom() * m--);
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
    }

    return array;
}

function Random(seed = seedElement.value) {
    this.seed = seed;
    this.nextSeededRandom = function() {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
}