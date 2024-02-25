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
      vis.highlight(n, 'lightgreen');
  } while (swapped && n > 0);
  vis.highlightAll('lightgreen');
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
  vis.highlightAll('lightgreen');
}

async function heapSort() {
  await buildMaxHeap();
  for(let i = vis.heapSize()-1; i >= 1; --i) {
    await vis.swap(0, i);
    vis.highlight(vis.heapSize()-1, 'lightgreen');
    vis.popHeap();
    await maxHeapify(0);
  }
  vis.popHeap();
  vis.highlightAll('lightgreen', true);
}

async function buildMaxHeap() {
  for(let i = Math.floor(vis.heapSize() / 2) - 1; i >= 0; --i) {
    await maxHeapify(i);
  }

}

async function maxHeapify(i) {
  vis.highlight(i, 'red');
  const l = vis.leftChild(i);
  const r = vis.rightChild(i);
  vis.highlight(l, 'cornflowerblue');
  vis.highlight(r, 'cornflowerblue');
  let largest = i;
  await vis.delay();
  if(l < vis.heapSize() && vis.compare(l, i) > 0) {
    largest = l;
  }
  if(r < vis.heapSize() && vis.compare(r, largest) > 0) {
    largest = r;
  }
  {
    if(largest === l) {
      vis.highlight(r, "darkgray");
      vis.highlight(i, "darkgray");
    }else if(largest === r) {
      vis.highlight(l, "darkgray");
      vis.highlight(i, "darkgray");
    }else {
      vis.highlight(l, "darkgray");
      vis.highlight(r, "darkgray");
    }
    vis.highlight(largest, "gold");
  }
  await vis.delay();
  if(largest != i) {
    vis.highlight(largest, "darkgray");
    vis.highlight(i, "gold");
    await vis.swap(i, largest);
    vis.deHighlightAll();
    await maxHeapify(largest);
  }else {
    vis.deHighlightAll();
  }
}

async function mergeSort() {
  vis.showBar(1);
  await _mergeSortWorker(0, vis.length()-1);
  vis.hideBar(1);
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
    if(p == 0 && r >= vis.length() - 1) {
      vis.highlight(merge+p,"lightgreen", 0);
    }
  }
}

async function countingSort() {
  vis.showBar(1);
  for(let i = 0; i < vis.length(0); ++i) {
    const j = vis.getValueAt(i) - 1;
    vis.highlight(i,"red");
    await vis.delay();
    vis.highlight(j, 'red', 1);
    await vis.setValueAt(j, vis.getValueAt(j, 1)+1, 1);
    vis.deHighlight(j, 1);
    vis.deHighlight(i,0);
  }

  await vis.delay();
  for(let i = 1; i < vis.length(1); ++i) {
    vis.highlight(i,"darkred",1);
    vis.highlight(i-1,"red",1);
    const thisValue = vis.getValueAt(i, 1);
    const beforeValue = vis.getValueAt(i-1, 1);

    await vis.setValueAt(i,thisValue + beforeValue, 1);
    vis.deHighlight(i,1);
    vis.deHighlight(i-1,1);
  }

  await vis.delay();
  vis.showBar(2);
  for(let i = vis.length(0)-1; i >= 0; --i) {
    const j = vis.getValueAt(i,0) - 1;
    const visValue = vis.getValueAt(j,1)- 1;
    vis.highlight(i,"red",0);
    vis.highlight(j,"red",1);
    vis.highlight(visValue,"darkred",2);
    vis.delay();
    await Promise.all([
      vis.setValueAt(j, visValue,1),
      vis.moveFromTo(visValue,j,2,1,-1),
      vis.setValueAt(visValue, j + 1, 2)
    ]);
    vis.resetTransforms(visValue,2);
    vis.highlight(visValue,'lightgreen',2);
    vis.deHighlight(i,0);
    vis.deHighlight(j,1);
  }

  const cleanup = [];
  for(let i = 0;  i < vis.length(1); ++i) {
    cleanup.push(vis.setValueAt(i,0, 1));
  }
  await Promise.all(cleanup);
  vis.hideBar(0);
  vis.hideBar(1);
}


async function radixSort() {
  for(let i = vis.rowLength(0) - 1 ; i >= 0 ; --i) {
    vis.highlightColumn(i, 'gold');
    await radix_countingSort(i);
    vis.deHighlightAll(0);
  }  
  vis.highlightAll('lightgreen');
}

async function radix_countingSort(column) {
  const counts = new Array(10).fill(0);
  for(let i = 0; i < vis.columnLength(column); ++i) {
    vis.highlightRow(i, 'lightgray');
    vis.highlightCell(i, column, 'lightsteelblue')
    const j = vis.readCell(i, column);
    counts[j] += + 1;
    await vis.delay();
    vis.deHighlightRow(i);
    vis.highlightCell(i, column, 'gold')
  }
  
  for(let i = 1; i < 10; ++i) {
    counts[i] += counts[i-1];
  }
  
  let output = new Array(vis.columnLength(column)).fill(0);
  for(let i = vis.columnLength(column) - 1; i >= 0; --i) {
    const j = vis.readCell(i, column);
    counts[j] -= 1;
    const countVal = counts[j];
    output[countVal] = vis.readRow(i);    
  }
  // visualize result
  await vis.delay();
  for(let i = 0; i < vis.columnLength(column); ++i) {
    vis.highlightRow(i, 'lightSalmon');
    vis.highlightCell(i, column, 'red')
    vis.writeRow(i, output[i]);
    await vis.delay();
    vis.deHighlightRow(i);
    vis.highlightCell(i, column, 'gold')
  }
}