
class HeapGraphVisualizer extends Visualizer {


    constructor(container, arr) {
        super();
        this.container = container;
        this.baseArr = arr;
        this.reset();
    }

    async shuffle() {
        await shuffleLinearArrayAnimated();
    }
    
    reset() {
        this.container.innerHTML = '';
        this.nodeBuffer = new Array(this.baseArr.length);
        this.arrBuffer = new Array(this.baseArr.length);
        this.graph = $(this.initArray(this.container, this.baseArr));
        this.addControls(this.container, true, () => this.reset());
    }

    initArray(container, arr) {
        const tree = document.createElement('div');
        tree.classList.add('tree');
        container.appendChild(tree);

        const treeRoot = document.createElement('ul');
        treeRoot.classList.add('tree-root');
        tree.appendChild(treeRoot);

        treeRoot.appendChild(this.initTree(treeRoot, arr, 0))

        const array = document.createElement('div');
        array.classList.add('arr-vis');
        container.appendChild(array);

        for(let i = 0; i < arr.length; ++i) {
            const ele = document.createElement('span');
            ele.innerText = arr[i];
            array.appendChild(ele);
            this.arrBuffer[i] = ele;
        }

        return container;
    }

    initTree(container, arr, index) {
        const li = document.createElement('li');
        container.appendChild(li);

        const node = document.createElement('span');
        node.classList.add('solidCircle');
        node.innerText = arr[index];
        li.appendChild(node);
        this.nodeBuffer[index] = node;

        const rightChildIndex = this.rightChild(index);
        const leftChildIndex = this.leftChild(index);
        if(rightChildIndex < arr.length || leftChildIndex < arr.length) {
            const ul = document.createElement('ul');
            li.appendChild(ul);

            if(leftChildIndex < arr.length) {
                ul.appendChild(this.initTree(ul, arr, leftChildIndex));
            }
            if(rightChildIndex < arr.length) {
                ul.appendChild(this.initTree(ul, arr, rightChildIndex));
            }
        }

        return li;
    }


    leftChild(i) {
        return ((i+1)<<1)-1;
    }

    rightChild(i) {
        return this.leftChild(i) + 1;
    }

    heapSize() {
        return this.nodeBuffer.length;
    }

    popHeap() {
        const ele = this.nodeBuffer.pop();
        if(!ele)
            return;

        const li = ele.parentNode;
        const ul = li.parentNode;

        li.remove();
        if(!ul.hasChildNodes()) {
            ul.remove();
        }
    }

    compare(i,j) {
        return +this.arrBuffer[i].innerText - +this.arrBuffer[j].innerText
    } 

    highlight(i, color, disregardHeapSize = false) {
        if(disregardHeapSize && i < this.arrBuffer.length || !disregardHeapSize && i < this.heapSize())
            this.arrBuffer[i].style.background = color;
        if(i < this.heapSize())
            this.nodeBuffer[i].style.background = color;
    }

    highlightAll(color, disregardHeapSize = false) {
        const n = disregardHeapSize ? this.arrBuffer.length : this.heapSize();
        for(let i = 0; i < n; ++i) {
            this.highlight(i, color, disregardHeapSize);
        }
    }

    deHighlight(i, disregardHeapSize = false) {
        this.highlight(i, 'none', disregardHeapSize);
    }

    deHighlightAll(disregardHeapSize = false) {
        const n = disregardHeapSize ? this.arrBuffer.length : this.heapSize();
        for(let i = 0; i < n; ++i) {
            this.deHighlight(i, disregardHeapSize);
        }
    }

    length() {
        return this.arrBuffer.length;
    }

    async swap(i,j, indexGraphI=0, indexGraphJ=0, duration = 1000, animate = true) {
        disableAllButtons();
        await Promise.all([
            this._swapInTree(i,j,duration,animate), 
            this._swapInArray(i,j,duration,animate)
        ]);

        if(!animating) {
            disableAllButtons(false);
        }
    }

    async _swapAnimationBetween(ele1, ele2, duration) {
        const offset1 = getElementOffset(ele1);
        const offset2 = getElementOffset(ele2);

        const x1 = offset2.left - offset1.left;
        const y1 = offset2.top - offset1.top;
        const x2 = offset1.left - offset2.left;
        const y2 = offset1.top - offset2.top;

        $(ele1).css('transform', `translate(${x1}px, ${y1}px)`).addClass('low-opac');
        $(ele2).css('transform', `translate(${x2}px, ${y2}px)`).addClass('low-opac');
        await $({x:0}).animate({x:1}, {
            duration: duration,
            step: function(val) {
                const posX1 = x1 - x1*val;
                const posX2 = x2 - x2*val;
                const posY1 = y1 - y1 * val
                const posY2 = y2 - y2 * val;

                $(ele1).css('transform', `translate(${posX1}px, ${posY1}px)`);
                $(ele2).css('transform', `translate(${posX2}px, ${posY2}px)`);
            },
            done: () =>{
                $(ele1).removeClass('low-opac');
                $(ele2).removeClass('low-opac');
            }
        }).promise();

    }

    async _swapInTree(i,j, duration, animate) {
        const temp = this.nodeBuffer[i].innerText;
        this.nodeBuffer[i].innerText = this.nodeBuffer[j].innerText;
        this.nodeBuffer[j].innerText = temp;

        if(animate) {
            if(i >= this.nodeBuffer.length || j >= this.nodeBuffer.length) {
                return;
            }
            await this._swapAnimationBetween(this.nodeBuffer[i], this.nodeBuffer[j], duration)
        }
    }

    async _swapInArray(i,j, duration, animate) {
        const temp = this.arrBuffer[i].innerText;
        this.arrBuffer[i].innerText = this.arrBuffer[j].innerText;
        this.arrBuffer[j].innerText = temp;

        if(animate) {
            if(i >= this.arrBuffer.length || j >= this.arrBuffer.length) {
                return;
            }
            await this._swapAnimationBetween(this.arrBuffer[i], this.arrBuffer[j], duration)
        }
    }
}