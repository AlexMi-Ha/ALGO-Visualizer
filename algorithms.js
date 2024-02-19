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

async function mergeSort() {
  await _mergeSortWorker(0, vis.length()-1);
}

async function _mergeSortWorker(i, j) {
  if(i >= j) {
    return;
  }
  const mid = Math.floor((i+j)/2);
  await _mergeSortWorker(i, mid);
  await _mergeSortWorker(mid + 1, j);

  await _mergeWorker(i,mid,j);
}

async function _mergeWorker(p,q,r) {
  for(let i = p; i <= q; ++i) {
    vis.highlight(i, "cadetblue")
  } 
  for(let i = q+1; i <= r; ++i) {
    vis.highlight(i, "cornflowerblue")
  } 
  
  i = p
  j = q + 1
  vis.highlight(i, "red");
  vis.highlight(j, "red");
  await vis.delay();

  mergeArrayIndex = 0;
  while(i <= q || j <= r) {
    await vis.delay();
    if ((i > q ? Math.min() : vis.getValueAt(i)) <= (j > r ? Math.min() : vis.getValueAt(j))) {
      vis.deHighlight(i);
      await vis.swap(i, mergeArrayIndex, 0, 1);
      ++i;
      if(i < vis.length() && i <= q)
        vis.highlight(i, "red");
    }else {
      vis.deHighlight(j);
      await vis.swap(j, mergeArrayIndex, 0, 1);
      ++j;
      if(j < vis.length() && j <= r)
        vis.highlight(j, "red");
    }
    ++mergeArrayIndex;
  }
  await vis.delay();
  for(let merge = 0; merge < mergeArrayIndex; ++merge) {
    await vis.swap(merge, merge+p, 1, 0);
  }
}

async function countingSort() {
  const input = [];
  for(let i = 0; i < vis.length(0); ++i) {
    const j = vis.getValueAt(i) - 1;
    vis.highlight(i,"red");
    input[i] = j + 1;
    await Promise.all([
      vis.moveFromTo(i,j, 0, 1, 1),
      vis.setValueAt(j, vis.getValueAt(j, 1)+1, 1),
    ]);
    await vis.setValueAt(i, 0, 0, 0, false);
    vis.resetTransforms(i, 0);
    vis.deHighlight(i);
  }

  for(let i = 1; i < vis.length(1); ++i) {
    vis.highlight(i,"darkred",1);
    vis.highlight(i-1,"red",1);
    const thisValue = vis.getValueAt(i, 1);
    const beforeValue = vis.getValueAt(i-1, 1);

    await vis.setValueAt(i,thisValue + beforeValue, 1);
    vis.deHighlight(i,1);
    vis.deHighlight(i-1,1);
  }

  for(let i = vis.length(0)-1; i >= 0; --i) {
    const j = input[i] - 1;
    const visValue = vis.getValueAt(j,1)- 1;
    vis.highlight(j,"red",1);
    vis.highlight(visValue,"darkred",0);
    await Promise.all([
      vis.setValueAt(j, visValue,1),
      vis.moveFromTo(visValue,j,0,1,-1),
      vis.setValueAt(visValue, j + 1, 0)
    ]);
    vis.resetTransforms(visValue,0);
    vis.deHighlight(visValue,0);
    vis.deHighlight(j,1);
  }

  const cleanup = [];
  for(let i = 0;  i < vis.length(1); ++i) {
    cleanup.push(vis.setValueAt(i,0, 1));
  }
  await Promise.all(cleanup);
}