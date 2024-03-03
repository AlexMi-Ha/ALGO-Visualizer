async function bubbleSort() {
  let swapped = false;
  let n = vis.length();
  do {
      swapped = false;
      for (let i = 1; i < n; ++i) {
          vis.highlight(i, "red");
          vis.highlight(i-1, "red");
          vis.log(`Compare index ${i} with ${i-1}`)
          await vis.delay();
          if (vis.compare(i-1, i) >= 0) {
              vis.log(`Index ${i-1} was smaller! Swapping...`)
              await vis.swap(i - 1, i);
              swapped = true;
          }
          vis.deHighlight(i);
          vis.deHighlight(i-1);
      }
      n--;
      vis.log(`Marking index ${n} as done!`)
      vis.highlight(n, 'lightgreen');
      await vis.delay();
  } while (swapped && n > 0);
  vis.log('Finished sorting!')
  vis.highlightAll('lightgreen');
}

async function insertionSort() {
  const len = vis.length() 
  for (let p = 1; p < len; ++p) {
    const _key = vis.getValueAt(p);
    vis.highlight(p, "red");
    vis.log(`Setting the key to ${_key}`)
    await vis.delay();
    let i = p - 1;

    while (i >= 0 && vis.getValueAt(i) > _key) {
      vis.highlight(i+1, "orange");
      vis.highlight(i, "yellow");
      vis.log(`Index ${i} is greater than the key!`);
      await vis.delay();
      vis.log('Propagating forward...');
      await vis.copyValueFromTo(i, i+1);
      vis.deHighlight(i);
      vis.deHighlight(i+1);
      i--;
    }
    if(i >= 0) {
      vis.highlight(i, "orange");
      vis.log(`Index ${i} is not greater than the key!`);
    }else {
      vis.log('Reached index 0. No comparison left!')
    }
    await vis.delay();
    if(i >= 0)
      vis.deHighlight(i);
    vis.deHighlight(p);
    vis.log(`Inserting the key at index ${i+1}...`);
    await vis.setValueAt(i + 1,_key);
    await vis.delay();
  }
  vis.log("Finished sorting!")
  vis.highlightAll('lightgreen');
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
  vis.log(`Heapifying index ${i}...`);
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
    vis.log(`Found largest element at index ${largest}!`);
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
  await _mergeSortWorker(0, vis.length()-1);
  vis.hideBar(1);
  vis.log('Finished sorting!')
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
  vis.log(`Merging sub array from index ${p} to ${q} with sub array from index ${q+1} to ${r}.`);
  await vis.delay();

  mergeArrayIndex = 0;
  while(i <= q || j <= r) {

    if(i > q || j > r) {
      vis.log('Moving the rest to the merge array')
    }else {
      vis.log(`Comparing index ${i} with index ${j}...`)
      await vis.delay();
    }
    
    
    if ((i > q ? Math.min() : vis.getValueAt(i)) <= (j > r ? Math.min() : vis.getValueAt(j))) {
      vis.deHighlight(i);

      if(!(i > q || j > r)) {
        vis.log(`Index ${i} was smaller. Moving to merge array...`)
      }
      
      await vis.swap(i, mergeArrayIndex, 0, 1);
      
      if(!(i > q || j > r)) {
        await vis.delay();
      }

      ++i;
      if(i < vis.length() && i <= q)
        vis.highlight(i, "red");
    }else {
      vis.deHighlight(j);

      if(!(i > q || j > r)) {
        vis.log(`Index ${j} was smaller. Moving to merge array...`)
      }      
      
      await vis.swap(j, mergeArrayIndex, 0, 1);
      
      if(!(i > q || j > r)) {
        await vis.delay();
      }
      
      ++j;
      if(j < vis.length() && j <= r)
        vis.highlight(j, "red");
    }
    ++mergeArrayIndex;
  }
  vis.log('Done merging the two sub arrays!');
  await vis.delay();
  vis.log('Moving back to original array...');
  for(let merge = 0; merge < mergeArrayIndex; ++merge) {
    await vis.swap(merge, merge+p, 1, 0);
    if(p == 0 && r >= vis.length() - 1) {
      vis.highlight(merge+p,"lightgreen", 0);
    }
  }
}

async function countingSort() {
  vis.showBar(1);
  vis.log('Counting phase...');
  await vis.delay();
  for(let i = 0; i < vis.length(0); ++i) {
    const j = vis.getValueAt(i) - 1;
    vis.highlight(i,"red");
    vis.log(`Accessing value from index ${i}.`);
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
    vis.log(`Writing index ${i} to index ${visValue}...`);
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
    vis.log(`Sorting digit ${i+1} with counting sort...`);
    vis.highlightColumn(i, 'gold');
    await vis.delay();
    await radix_countingSort(i);
    vis.deHighlightAll(0);
  }  
  vis.highlightAll('lightgreen');
  vis.log('Finished sorting!');
}

async function radix_countingSort(column) {
  const counts = new Array(10).fill(0);
  for(let i = 0; i < vis.columnLength(column); ++i) {
    vis.highlightRow(i, 'lightgray');
    vis.highlightCell(i, column, 'lightsteelblue')
    const j = vis.readCell(i, column);
    counts[j] += + 1;
    vis.log(`Counting the digit value '${j}'`);
    await vis.delay();
    vis.deHighlightRow(i);
    vis.highlightCell(i, column, 'gold')
  }
  vis.log('Sorting the array with counting sort...');
  
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
    vis.log(`Writing number '${output[i]}' in row ${i}!`);
    await vis.delay();
    vis.deHighlightRow(i);
    vis.highlightCell(i, column, 'gold')
  }
}