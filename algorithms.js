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

function swap(A, i, j) {
  let temp = A[i];
  A[i] = A[j];
  A[j] = temp;
}

async function heapSort(A) {
  await buildMaxHeap(A);
  for(let i = A.length; i >= 2; --i) {
    {
      vis.select(0);
      vis.select(i-1);
      await vis.delay();
    }
    swap(A, 0, i-1);
    {
      vis.log("Switching first element with last element");
      vis.swap(0,i-1);
      await vis.delay();
      vis.deselect(0);
      vis.deselect(i-1);
      await vis.delay();
    }
    A.heapSize -= 1;
    {
      vis.log("Reducing heap size to " + A.heapSize);
      vis.finished(i-1);
      await vis.delay();
    }
    await maxHeapify(A, 1);
  }
  {
    vis.finished(0);
  }
}

async function buildMaxHeap(A) {
  A.heapSize = A.length;
  {
    vis.log("Building Max Heap")
  }
  for(let i = Math.floor(A.length / 2); i >= 1; --i) {
    await maxHeapify(A, i);
  }

}

async function maxHeapify(A, i) {
  const l = (i << 1);
  const r = (i << 1) + 1;
  let largest = i;
  {
    vis.log("Heapifying index " + i);
    vis.select(i-1);
    vis.select(l-1);
    await vis.delay();
  }
  if(l <= A.heapSize && A[l-1] > A[i-1]) {
    largest = l;
  }else {
    vis.deselect(l-1);
  }
  {
    await vis.delay();
    vis.select(r-1);
    await vis.delay();
  }
  if(r <= A.heapSize && A[r-1] > A[largest-1]) {
    largest = r;
    {
      vis.deselect(l-1);
    }
  }else {
    vis.deselect(r-1);
  }
  {
    await vis.delay();
  }
  if(largest != i) {
    swap(A, i-1, largest-1);
    {
      if(largest == l) {
        vis.log("Left child is the largest. Switching with i");
      }else if(largest == r) {
        vis.log("Right child is the largest. Switching with i");
      }
      vis.swap(i-1, largest-1);
      await vis.delay();
      vis.deselect(i-1);
      vis.deselect(largest-1);
      await vis.delay();
    }
    await maxHeapify(A, largest);
  }else {
    vis.log("Root of subtree is already the largest");
    vis.deselect(i-1);
    vis.deselect(largest-1);
    await vis.delay();
  }
}