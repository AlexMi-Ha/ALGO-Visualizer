async function bubbleSort(A) {
  let swapped = false;
  let n = A.length;
  do {
    swapped = false;
    for (let i = 1; i < n; ++i) {
      {
        vis.select(i);
        await vis.delay();
        vis.log(`${A[i - 1]} > ${A[i]}?`)
      }
      if (A[i - 1] > A[i]) {
        swap(A, i - 1, i);
        swapped = true;
        {
          vis.log(`Swap index ${i - 1} and ${i}`);
          vis.swap(i - 1, i);
          await vis.delay();
        }
      }
      {
        vis.deselect(i - 1);
        vis.deselect(i);
        await vis.delay();
      }
    }
    n--;
    {
      vis.finished(n);
      if (!swapped && n - 1 >= 0) {
        await vis.delay();
        await vis.victoryAnimation(n - 1, 0);
      }
      await vis.delay();
    }
  } while (swapped && n > 0);
}

async function insertionSort(A) {
  for (let p = 1; p < A.length; ++p) {
    const _key = A[p];
    let i = p - 1;
    {
      vis.select(i);
      vis.markIndex(p);
      await vis.delay();
    }
    while (i >= 0 && A[i] > _key) {
      A[i + 1] = A[i];
      {
        vis.setValue(i + 1, A[i]);
        vis.deselect(i);
        await vis.delay();
        if (i > 0) {
          vis.select(i - 1);
          await vis.delay();
        }
      }
      i--;
    }
    A[i + 1] = _key
    {
      vis.setValue(i + 1, _key);
      vis.markIndex(i + 1);
      if (i >= 0) {
        vis.deselect(i);
      }
      await vis.delay();

      vis.unmarkIndexes();
      await vis.delay();
    }
  }
  {
    await vis.victoryAnimation(0, A.length - 1);
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
      vis.swap(0,i-1);
      await vis.delay();
      vis.deselect(0);
      vis.deselect(i-1);
      await vis.delay();
    }
    A.heapSize -= 1;
    {
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
      vis.swap(i-1, largest-1);
      await vis.delay();
      vis.deselect(i-1);
      vis.deselect(largest-1);
      await vis.delay();
    }
    await maxHeapify(A, largest);
  }else {
    vis.deselect(i-1);
    vis.deselect(largest-1);
    await vis.delay();
  }
}