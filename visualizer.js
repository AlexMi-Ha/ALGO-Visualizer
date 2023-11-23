class Element {
    constructor(value) {
      this.value = value;
      this.selected = false;
      this.finished = false;
    }
  }
  
  class BarGraphVisualizer {
    
    constructor(arr) {
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
      const widthScaleFactor = width/10;
      const heightScaleFactor = height/15;
      for(let i = 0; i < this.arr.length; ++i) {
        drawRect(this.arr[i], i, widthScaleFactor, heightScaleFactor, this.markedIndex);
      }
    }
    
    async delay(duration = speedSlider.value) {
      await sleep(duration);
    }
    
    debug() {
      console.log(this.arr);
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
    
    swap(i,j) {
      const temp = this.arr[i];
      this.arr[i] = this.arr[j];
      this.arr[j] = temp;
    }
    
    async victoryAnimation(start, end) {
      const startToFinish = start <= end;
      for(let i = start; (startToFinish && i <= end) || (!startToFinish && i >= end); startToFinish ? ++i : --i) {
        this.finished(i);
        await this.delay();
      }
    }
  }
  
  const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));
  
  function drawRect(element, index, widthScaleFactor, heightScaleFactor, markedIndex) {
    if(element.selected) {
      fill(255,0,0);
    }else if(element.finished) {
      fill(0,255,0);
    }else if(markedIndex.includes(index)) {
      fill(255, 255, 0);
    }else{
      fill(0);
    }
    rect(widthScaleFactor*index, height - element.value * heightScaleFactor, widthScaleFactor, element.value * heightScaleFactor);
  }