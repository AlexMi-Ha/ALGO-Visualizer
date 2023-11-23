class BinaryTreeNode {
    constructor(leftChild, rightChild,parent, x,y) {
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        this.parent = parent
        this.x = x;
        this.y = y;
    }

    draw(widthScaleFactor, heightScaleFactor, value, selected) {
        if(this.parent) {
            line(this.x, this.y, this.parent.x, this.parent.y);
        }
        fill(0,0,0,255);
        if(selected) {
            fill(255,0,0);
        }
        ellipse(this.x,this.y, widthScaleFactor, heightScaleFactor)
        fill(255);
        textAlign(CENTER,CENTER);
        text(value, this.x, this.y);
    }
}

class ArrayBinaryTreeNode {
    constructor(valueArr, leftChild, rightChild, x,y) {
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        this.valueArr = valueArr;
        this.x = x;
        this.y = y;
    }

    draw(widthScaleFactor, heightScaleFactor) {
        rect(this.x*widthScaleFactor, this.y*widthScaleFactor, this.valueArr.length * widthScaleFactor, heightScaleFactor);
        for(let i = 0; i < this.valueArr.length; ++i) {
            text(this.valueArr[i], this.x*widthScaleFactor + i*widthScaleFactor, this.y*heightScaleFactor);
        }

        this.leftChild?.draw();
        this.rightChild?.draw();
    }
}

class BinaryTreeVisualizer extends Visualizer {

    root = undefined;
    leafCount = undefined;

    nodes = [];
    nodeValues = [];
    selected = [];
    finishedNodes = [];

    displayValueArrayAtBottom = false;

    constructor(logContainer) {
        super(logContainer);
    }

    constructBinaryHeapLike(arr) {
        this.root = new BinaryTreeNode(arr[0],undefined,undefined,width/2,50);
        this.leafCount = Math.floor(arr.length / 2);
        this.recursiveConstruct(this.root, arr, [],0);
        this.positionTree();
        this.displayValueArrayAtBottom = true;
    }

    recursiveConstruct(root, arr, outputArr, rootIndex) {
        this.nodes[rootIndex] = root;
        this.nodeValues[rootIndex] = arr[rootIndex];

        const leftIndex = this.left(rootIndex);
        if(leftIndex < arr.length) {
            root.leftChild = new BinaryTreeNode();
            root.leftChild.parent = root;
            this.recursiveConstruct(root.leftChild,arr,outputArr,leftIndex);
        }
        const rightIndex = this.right(rootIndex);
        if(rightIndex < arr.length) {
            root.rightChild = new BinaryTreeNode();
            root.rightChild.parent = root;
            this.recursiveConstruct(root.rightChild,arr,outputArr,rightIndex);
        }
    }

    positionTree() {
        let maxDepth = 0;
        const leafCounts = {};
        let marked = {};
        const analyzer = (index, depth) => {
            marked[index] = true;
            leafCounts[index] = 0;
            if(maxDepth < depth) {
                maxDepth = depth;
            }
            const left = this.left(index);
            const right = this.right(index);
            if(left < this.nodes.length && !marked[left]) {
                leafCounts[index] += analyzer(left, depth+1);
            }
            if(right < this.nodes.length && !marked[right]) {
                leafCounts[index] += analyzer(right, depth+1);
            }
            if(!leafCounts[index]) {
                leafCounts[index] = 1;
            }
            return leafCounts[index];
        }
        analyzer(0,0);

        const hGap = width / (leafCounts[0]);
        const vGap = height / (maxDepth+3);

        marked = {};
        const position = (index, h, v) => {
            marked[index] = true;
            const node = this.nodes[index];
            node.x = (h + leafCounts[index] / 2) * hGap;
            node.y = v*vGap;
            const left = this.left(index);
            const right = this.right(index);
            if(left < this.nodes.length && !marked[left]) {
                position(left,h,v+1);
                h += leafCounts[left];
            }
            if(right < this.nodes.length && !marked[right]) {
                position(right, h,v+1);;
            }
        }
        position(0,0,1);
    }

    left(i) {
        return ((i+1) << 1) - 1
    }

    right(i) {
        return ((i+1) << 1);
    }

    parent(i) {
        return Math.max(0,((i+1) >> 1) - 1);
    }

    show() {
        for(let i = this.nodes.length-1; i >=0; --i) {
            if(!this.finishedNodes[i]) {
                this.nodes[i].draw(25,25,this.nodeValues[i], this.selected[i]);
            }
        }
        if(this.displayValueArrayAtBottom) {
            fill(255);
            rect(10, height-40, width-20, 30);
            const widthPerCell = Math.floor((width-20) / this.nodeValues.length);
            fill(0);
            for(let i = 0; i < this.nodeValues.length; ++i) {
                if(this.selected[i]) {
                    fill(255,0,0);
                    rect(10+i*widthPerCell, height-40, widthPerCell, 30);
                    fill(0);
                }
                if(this.finishedNodes[i]) {
                    fill(0,255,255);
                    rect(10+i*widthPerCell, height-40, widthPerCell, 30);
                    fill(0);
                }
                textAlign(CENTER);
                text(this.nodeValues[i], 10 + i*widthPerCell + widthPerCell / 2, height-20);
                line(10 + i*widthPerCell, height-40, 10+i*widthPerCell, height-10);
            }
        }
    }

    select(i) {
        this.selected[i] = true;
    }
    
    deselect(i) {
        this.selected[i] = false;
    }

    finished(i) {
        this.finishedNodes[i] = true;
    }

    swap(i,j) {
        const temp = this.nodeValues[i];
        this.nodeValues[i] = this.nodeValues[j];
        this.nodeValues[j] = temp;
    }

    deleteNode(i) {
        const node = this.nodes[i];
        this.nodes.splice(i,1);
        this.nodeValues.splice(i,1);
        const parentIndex = this.parent(i);
        if(this.nodes[parent]?.leftChild === node) {
            this.nodes[parent].leftChild = undefined;
        }
        if(this.nodes[parent]?.rightChild === node) {
            this.nodes[parent].rightChild = undefined;
        }
    }
}