class Element {
    constructor(value) {
        this.value = value;
        this.selected = false;
        this.finished = false;
    }
}

class BarGraphVisualizer extends Visualizer {

    constructor(arr, logContainer) {
        super(logContainer);
        this.updateArr(arr);
        this.markedIndex = [];
    }

    resetAll() {
        this.arr.forEach(x => {
            x.selected = false;
            x.finished = false;
        })
    }

    updateArr(arr) {
        this.arr = arr.map(e => new Element(e));
    }

    show() {
        fill(0);
        const widthScaleFactor = width / 10;
        const heightScaleFactor = height / 15;
        for (let i = 0; i < this.arr.length; ++i) {
            drawRect(this.arr[i], i, widthScaleFactor, heightScaleFactor, this.markedIndex);
        }
        drawIndex(0, this.arr.length, widthScaleFactor);
    }

    select(i) {
        this.arr[i].selected = true;
    }

    deselect(i) {
        this.arr[i].selected = false;
    }

    finished(i) {
        this.arr[i].finished = true;
    }

    markIndex(i) {
        this.markedIndex.push(i);
    }

    unmarkIndexes() {
        this.markedIndex = [];
    }

    setValue(index, value) {
        this.arr[index].value = value;
    }

    swap(i, j) {
        const temp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = temp;
    }

    async victoryAnimation(start, end) {
        const startToFinish = start <= end;
        for (let i = start; (startToFinish && i <= end) || (!startToFinish && i >= end); startToFinish ? ++i : --i) {
            this.finished(i);
            await this.delay();
        }
    }
}

function drawRect(element, index, widthScaleFactor, heightScaleFactor, markedIndex) {
    const yOffset = 20;
    noStroke();
    textAlign(CENTER);
    if (element.selected) {
        fill(255, 0, 0, 128);
    } else if (element.finished) {
        fill(0, 200, 0, 128);
    } else if (markedIndex.includes(index)) {
        fill(255, 255, 0, 128);
    } else {
        fill(0, 0, 0, 128);
    }
    rect(widthScaleFactor * index, height - element.value * heightScaleFactor - yOffset, widthScaleFactor, element.value * heightScaleFactor);
    fill(255);
    text(element.value, widthScaleFactor * index + widthScaleFactor / 2, height - element.value * heightScaleFactor);
}

function drawIndex(min, max, widthScaleFactor) {
    noStroke();
    fill(0);
    for (let i = min; i < max; ++i) {
        text(i, i * widthScaleFactor + widthScaleFactor / 2, height - 5);
    }
}