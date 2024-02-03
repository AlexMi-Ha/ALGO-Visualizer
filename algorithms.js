async function bubbleSort() {
  let swapped = false;
  let n = vis.length();
  do {
      swapped = false;
      for (let i = 1; i < n; ++i) {
          vis.highlight(i, "red");
          vis.highlight(i-1, "red");
          await vis.delay();
          if (vis.compare(i-1, i) >= 0) {
              await vis.swap(i - 1, i);
              swapped = true;
          }
          vis.deHighlight(i);
          vis.deHighlight(i-1);
      }
      n--;
      vis.highlight(n, 'green');
  } while (swapped && n > 0);
  vis.highlightAll('green');
}

async function insertionSort() {
  const len = vis.length() 
  for (let p = 1; p < len; ++p) {
    const _key = vis.getValueAt(p);
    vis.highlight(p, "red");
    await vis.delay();
    let i = p - 1;

    while (i >= 0 && vis.getValueAt(i) > _key) {
      vis.highlight(i+1, "orange");
      vis.highlight(i, "yellow");
      await vis.delay();
      await vis.copyValueFromTo(i, i+1);
      vis.deHighlight(i);
      vis.deHighlight(i+1);
      i--;
    }
    if(i >= 0)
      vis.highlight(i, "orange");
    await vis.delay();
    if(i >= 0)
      vis.deHighlight(i);
    vis.deHighlight(p);
    await vis.setValueAt(i + 1,_key);
  }
}

async function heapSort() {
  console.log("lel", vis.heapSize());
  await buildMaxHeap();
  for(let i = vis.heapSize()-1; i >= 1; --i) {
    console.log("Sorting " + i);
    await vis.swap(0, i);
    vis.popHeap();
    await maxHeapify(0);
  }
  console.log("done");
}

async function buildMaxHeap() {
  for(let i = Math.floor(vis.heapSize() / 2) - 1; i >= 0; --i) {
    await maxHeapify(i);
  }

}

async function maxHeapify(i) {
  console.log("Called heapify on " + i)
  const l = vis.leftChild(i);
  const r = vis.rightChild(i);
  let largest = i;

  console.log("Checking left for bigger: Left:" + i + " Heapsize: " + vis.heapSize())
  if(l < vis.heapSize() && vis.compare(l, i) > 0) {
    largest = l;
  }
  if(r < vis.heapSize() && vis.compare(r, largest) > 0) {
    largest = r;
  }
  console.log("largest between " + i + " " + l + " " + r + " was " + largest);
  if(largest != i) {
    await vis.swap(i, largest);
    await maxHeapify(largest);
  }
}