async function bubbleSort() {
  let swapped = false;
  let n = vis.length();
  do {
      swapped = false;
      for (let i = 1; i < n; ++i) {
          vis.highlight(i, "red");
          vis.highlight(i-1, "red");
          vis.log(`Compare A[${i+1}] with A[${i-1+1}]`)
          await vis.delay();
          if (vis.compare(i-1, i) >= 0) {
              vis.log(`A[${i-1+1}] was smaller! Swapping...`)
              await vis.swap(i - 1, i);
              swapped = true;
          }
          vis.deHighlight(i);
          vis.deHighlight(i-1);
      }
      n--;
      vis.log(`Marking A[${n}] as done!`)
      vis.highlight(n, 'lightgreen');
      await vis.delay();
  } while (swapped && n > 0);
  vis.log('Finished sorting!')
  vis.highlightAll('lightgreen');
}

async function insertionSort() {
  vis.showMetadata({"Itr": "0", "Key": "-"})
  const len = vis.length() 
  for (let p = 1; p < len; ++p) {
    const _key = vis.getValueAt(p);
    vis.highlight(p, "red");
    vis.log(`Setting the key to ${_key}`)
    vis.updateMetadata('Key', _key);
    vis.updateMetadata('Itr', p);
    await vis.delay();
    let i = p - 1;
    vis.highlightIndex(i);

    while (i >= 0 && vis.getValueAt(i) > _key) {
      vis.highlight(i+1, "orange");
      vis.highlight(i, "yellow");
      vis.log(`A[${i+1}] is greater than the key!`);
      await vis.delay();
      vis.log('Propagating forward...');
      await vis.copyValueFromTo(i, i+1);
      vis.deHighlight(i);
      vis.deHighlight(i+1);
      i--;
      if(i >= 0)
        vis.highlightIndex(i);
    }
    if(i >= 0) {
      vis.highlight(i, "orange");
      vis.log(`A[${i+1}] is not greater than the key!`);
    }else {
      vis.deHighlightAllIndexes();
      vis.log('Reached index 1. No comparison left!')
    }
    await vis.delay();
    if(i >= 0)
      vis.deHighlight(i);
    vis.deHighlight(p);
    vis.log(`Inserting the key at A[${i+1+1}]...`);
    await vis.setValueAt(i + 1,_key);
    await vis.delay();
    vis.deHighlightAllIndexes();
  }
  vis.log("Finished sorting!")
  vis.highlightAll('lightgreen');
  vis.removeMetadata();
}

async function heapSort() {
  await buildMaxHeap();
  for(let i = vis.heapSize()-1; i >= 1; --i) {
    vis.log('Moving the root node to the finished pile!')
    vis.highlight(vis.heapSize()-1, 'lightgreen');
    await vis.swap(0, i);
    vis.highlight(vis.heapSize()-1, 'lightgreen');
    vis.popHeap();
    await vis.delay();
    await maxHeapify(0);
  }
  vis.popHeap();
  vis.highlightAll('lightgreen', true);
  vis.log('Finished sorting!')
}

async function buildMaxHeap() {
  vis.log("Building max heap...")
  await vis.delay();
  for(let i = Math.floor(vis.heapSize() / 2) - 1; i >= 0; --i) {
    await maxHeapify(i);
  }
  vis.log('Done building the max heap!')
  await vis.delay();
}

async function maxHeapify(i) {
  vis.highlight(i, 'red');
  vis.log(`Heapifying A[${i+1}]...`);
  await vis.delay();
  const l = vis.leftChild(i);
  const r = vis.rightChild(i);
  vis.highlight(l, 'cornflowerblue');
  vis.highlight(r, 'cornflowerblue');
  let largest = i;
  vis.log(`Searching largest element between parent and children...`)
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
    vis.log(`Found largest element at A[${largest+1}]!`);
  }
  await vis.delay();
  if(largest != i) {
    vis.highlight(largest, "darkgray");
    vis.highlight(i, "gold");
    vis.log('Swapping the largest element with the parent...');
    await vis.swap(i, largest);
    await vis.delay();
    vis.deHighlightAll();
    await maxHeapify(largest);
  }else {
    vis.log('The parent is already the largest element!');
    vis.deHighlight(r);
    vis.deHighlight(l);
    await vis.delay();
    vis.deHighlight(i);
    
  }
}

async function mergeSort() {
  vis.showBar(1);
  vis.showBar(2);
  await _mergeSortWorker(0, vis.length()-1);
  vis.hideBar(1);
  vis.hideBar(2);
  vis.log('Finished sorting!');
  vis.highlightAll('lightgreen');
}

async function _mergeSortWorker(i, j) {
  if(i >= j) {
    return;
  }
  vis.log(`Dividing region from index ${i+1} to ${j+1}`);
  vis.highlightIndex(i, 'p', false);
  vis.highlightIndex(j, 'r', false);
  await vis.delay();
  const mid = Math.floor((i+j)/2);
  vis.log(`Found the middle at index ${mid+1}`);
  vis.highlightIndex(mid, 'q', false);
  await vis.delay();
  vis.deHighlightAllIndexes();
  await _mergeSortWorker(i, mid);
  await _mergeSortWorker(mid + 1, j);
  
  
  vis.highlightIndex(i, 'p', false);
  vis.highlightIndex(j, 'r', false);
  vis.highlightIndex(mid, 'q', false);
  if(i < mid || mid+1 < j) {
    vis.log('Updated p, q and r');
    await vis.delay();
  }
  vis.log(`Merging subarray with p: ${i+1}, q: ${mid+1} and r: ${j+1}.\nMoving to helper arrays...`);
  await _mergeWorker(i,mid,j);
  vis.deHighlightAllIndexes();
}

async function _mergeWorker(p,q,r) {
  const n1 = q-p+1;
  const n2 = r-q;

  let movePromises = [];
  for(let i = p; i <= q; ++i) {
    vis.highlight(i, "cadetblue");
    movePromises.push(vis.swap(i, i-p, 0,1));
  } 
  for(let i = q+1; i <= r; ++i) {
    vis.highlight(i, "cornflowerblue")
    movePromises.push(vis.swap(i, i-(q+1), 0,2));
  }
  await Promise.all(movePromises);
  await vis.delay();

  let i = 0;
  let j = 0;
  vis.highlight(i, "red", 1);
  vis.highlight(j, "red", 2);

  let mergeArrayIndex = p;
  while(mergeArrayIndex <= r) {

    if(i >= n1 || j >= n2) {
      vis.log('Moving the rest to the merge array')
    }else {
      vis.log(`Comparing L[${i+1}] with R[${j+1}]...`)
      await vis.delay();
    }
    
    
    if ((i >= n1 ? Math.min() : vis.getValueAt(i, 1)) <= (j >= n2 ? Math.min() : vis.getValueAt(j, 2))) {
      vis.deHighlight(i,1);

      if(!(i >= n1 || j >= n2)) {
        vis.log(`L[${i+1}] was smaller. Moving to merge array...`)
      }
      
      await vis.swap(i, mergeArrayIndex, 1, 0);
      
      if(!(i >= n1 || j >= n2)) {
        await vis.delay();
      }

      ++i;
      if(i < n1)
        vis.highlight(i, "red", 1);
    }else {
      vis.deHighlight(j, 2);

      if(!(i >= n1 || j >= n2)) {
        vis.log(`R[${j+1}] was smaller. Moving to merge array...`)
      }      
      
      await vis.swap(j, mergeArrayIndex, 2, 0);
      
      if(!(i >= n1 || j >= n2)) {
        await vis.delay();
      }
      
      ++j;
      if(j < n2)
        vis.highlight(j, "red", 2);
    }
    ++mergeArrayIndex;
  }
  vis.log('Done merging the two sub arrays!');
  await vis.delay();
}

async function countingSort() {
  vis.showBar(1);
  vis.log('Counting phase...');
  await vis.delay();
  for(let i = 0; i < vis.length(0); ++i) {
    const j = vis.getValueAt(i) - 1;
    vis.highlight(i,"red");
    vis.log(`Accessing value A[${i+1}].`);
    await vis.delay();
    vis.highlight(j, 'red', 1);
    vis.log(`Incrementing count of number ${j+1} in the array!`);
    await vis.setValueAt(j, vis.getValueAt(j, 1)+1, 1);
    await vis.delay();
    vis.deHighlight(j, 1);
    vis.deHighlight(i,0);
  }

  vis.log("Done counting! Summing up the totals...")
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

  vis.log('Retrieving sorted array from counts...')
  await vis.delay();
  vis.showBar(2);
  for(let i = vis.length(0)-1; i >= 0; --i) {
    const j = vis.getValueAt(i,0) - 1;
    const visValue = vis.getValueAt(j,1)- 1;
    vis.highlight(i,"red",0);
    vis.highlight(j,"red",1);
    vis.highlight(visValue,"darkred",2);
    vis.log(`Count of number ${j+1} is '${visValue+1}'`);
    await vis.delay();
    vis.log(`Writing A[${i+1}] to B[${visValue+1}]...`);
    await Promise.all([
      vis.setValueAt(j, visValue,1),
      vis.moveFromTo(visValue,j,2,1,-1),
      vis.setValueAt(visValue, j + 1, 2)
    ]);
    vis.resetTransforms(visValue,2);
    vis.highlight(visValue,'lightgreen',2);
    await vis.delay();
    vis.deHighlight(i,0);
    vis.deHighlight(j,1);
  }
  vis.log('Cleaning up...');
  const cleanup = [];
  for(let i = 0;  i < vis.length(1); ++i) {
    cleanup.push(vis.setValueAt(i,0, 1));
  }
  await Promise.all(cleanup);
  vis.hideBar(0);
  vis.hideBar(1);
  vis.log('Finished sorting!');
}


async function radixSort() {
  for(let i = vis.rowLength(0) - 1 ; i >= 0 ; --i) {
    vis.log(`Sorting the array based on digit ${i+1}...`);
    vis.highlightColumn(i, 'gold');
    await vis.delay();
    await radix_countingSort(i);
    vis.deHighlightAll(0);
  }  
  vis.highlightAll('lightgreen');
  vis.log('Finished sorting!');
  vis.hideMatrix(1);
}

async function radix_countingSort(column) {
  const counts = new Array(10).fill(0);
  const logEles = [];
  for(let i = 0; i < vis.columnLength(column); ++i) {
    const j = vis.readCell(i, column);
    logEles.push(j);
    counts[j] += + 1;
  }
  vis.log(`CoutingSort([${logEles.join(', ')}])`);
  vis.showMatrix(1);
  await vis.delay();
  for(let i = 1; i < 10; ++i) {
    counts[i] += counts[i-1];
  }
  
  let output = new Array(vis.columnLength(column)).fill(0);
  for(let i = vis.columnLength(column) - 1; i >= 0; --i) {
    const j = vis.readCell(i, column);
    counts[j] -= 1;
    const countVal = counts[j];
    output[countVal] = vis.readRow(i);    
    vis.deHighlightRow(i);
    await vis.swapRows(i, countVal, 0,1);
    await vis.delay();
  }

  const movePromises = [];
  for(let row = 0; row < vis.columnLength(0,1); ++row) {
    movePromises.push(vis.swapRows(row, row, 0, 1));
  }
  await Promise.all(movePromises);
  vis.log(`Finished sorting the array based on digit ${column+1}!`);
  await vis.delay();

  vis.deHighlightAll(1);
}


async function quickSort() {
  await _quickSortWorker(0, vis.length()-1);

  vis.highlightAll('lightgreen');
  vis.log('Finished sorting!');
}

async function _quickSortWorker(start, end) {
  if(start >= end) {
    return;
  }
  for(let i = start; i <= end; ++i) {
    vis.highlight(i, 'cadetblue')
  }
  const q = await _partitionWorker(start, end)
  vis.deHighlightAll();
  await _quickSortWorker(start, q-1);
  await _quickSortWorker(q+1, end);
}

async function _partitionWorker(start, end) {
  const x = vis.getValueAt(end);
  vis.highlight(end, 'red');
  vis.log(`Partitioning from index ${start+1} to ${end+1} with pivot value ${x}!`);
  await vis.delay();
  let i = start - 1;
  if(i >= 0)
    vis.highlight(i, 'orange');
  for(let j = start; j < end; ++j) {
    vis.log(`Comparing A[${j+1}] with the pivot...`)
    vis.highlight(j, 'orange');
    await vis.delay();
    if(vis.getValueAt(j) <= x) {

      vis.log(`A[${j+1}] was smaller than the pivot! Moving it to the 'less than' pile...`)
      
      if(i >= 0)
        vis.highlight(i, 'cadetblue');
      ++i;
      vis.highlight(i, 'cornflowerblue');
      vis.highlight(j, 'orange'); 
      if(i !== j) {
        await vis.swap(i,j);
      }
    }else {
      vis.log(`A[${j+1}] was larger than the pivot. Continuing partition...`)
      vis.highlight(j, 'cornflowerblue');
    }
    await vis.delay();
  }
  vis.log('Done partitioning!')
  await vis.delay();
  vis.log('Inserting the pivot between the piles...');
  if(i+1 !== end) {
    await vis.swap(i+1, end);
  }
  if(i >= 0) {
    vis.highlight(i, 'cadetblue');
  }
  await vis.delay();
  vis.deHighlight(i+1);
  return i+1;
}