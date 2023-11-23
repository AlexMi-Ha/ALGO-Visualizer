async function bubbleSort(A) {
  let swapped = false;
  let n = A.length;
  do {
    swapped = false;
    for(let i = 1; i < n; ++i) {
      {
        vis.select(i);
        await vis.delay();
      }
      if(A[i-1] > A[i]) {
        swap(A, i-1, i);
        swapped = true;
        {
          vis.swap(i-1, i);
          await vis.delay();
        }
      }
      {
        vis.deselect(i-1);  
        vis.deselect(i);
        await vis.delay();
      }
    }
    n--;
    {
      vis.finished(n);
      if(!swapped && n-1 >= 0) {
        await vis.delay();
        await vis.victoryAnimation(n-1, 0);
      }
      await vis.delay();
    }
  } while(swapped && n > 0);
}

async function insertionSort(A) {
  for (let p = 1; p < A.length; ++p) {
    const _key = A[p];
    let i = p-1;
    {
      vis.select(i);
      vis.markIndex(p);
      await vis.delay();
    }
    while (i >= 0 && A[i] > _key) {
      A[i+1] = A[i];
      {
        vis.setValue(i+1, A[i]);
        vis.deselect(i);
        await vis.delay();
        if(i > 0) {
          vis.select(i-1);
          await vis.delay();
        }
      }
      i--;
    }
    A[i+1] = _key
    {
      vis.setValue(i+1, _key);
      vis.markIndex(i+1);
      if(i >= 0) {
        vis.deselect(i);
      }
      await vis.delay();

      vis.unmarkIndexes();
      await vis.delay();
    }
  }
  {
    await vis.victoryAnimation(0, A.length -1);
  }
}

function swap(A, i, j) {
  let temp = A[i];
  A[i] = A[j];
  A[j] = temp;
}
