
class MatrixGraphVisualizer extends Visualizer {


    constructor(container) {
        super();
        this.container = container;
        this.allGraphsContainer = document.createElement('div');
        this.allGraphsContainer.classList.add('allgraphs-container');
        this.container.appendChild(this.allGraphsContainer);
    }

    async shuffle() {
        if(this.isColumnMatrix) {
            await _shuffleAnimated(
                (i) => this.highlightRow(i, 'red', 0, false),
                (i) => this.deHighlightRow(i, 0),
                (i,j) => this.swapRows(i,j,0,0, 100),
                () => this.columnLength(0,0),
                () => this.deHighlightAll(0)
            );
        }
    }

    matrixBuffer = [];
    isColumnMatrix = false;

    initRadixMatrix(arr) {
        this.isColumnMatrix = true;
        let maxLength = 1;
        for(let i = 0 ; i < arr.length; ++i) {
            arr[i] = ""+arr[i];
            maxLength = Math.max(arr[i].length, maxLength);
        }
        const helperArr = new Array(arr.length);
        for(let i = 0; i < arr.length; ++i) {
            arr[i] = arr[i].padStart(maxLength, '0').split('');
            helperArr[i] = new Array(maxLength).fill('');
        }
        this.initMatrix(arr.length, maxLength, arr, true);
        this.initMatrix(arr.length, maxLength, helperArr, true)
        this.addControls(this.container);

        this.hideMatrix(1);
    }

    initMatrix(rows, cols, vals, hideInternalColumnBorders = false) {
        const matrix = document.createElement('div');
        matrix.classList.add('matrix-container');
        this.allGraphsContainer.appendChild(matrix);

        const matrixIndex = this.matrixBuffer.length;
        this.matrixBuffer.push(new Array(rows));

        const matrixBorders = document.createElement('div');
        matrixBorders.classList.add('matrix-borders');
        matrix.appendChild(matrixBorders);

        const matrixContent = document.createElement('div');
        matrixContent.classList.add('matrix-content');
        matrix.appendChild(matrixContent);

        for(let i = 0; i < rows; ++i) {
            this.matrixBuffer[matrixIndex][i] = new Array(cols);

            const arrVis = document.createElement('div');
            arrVis.classList.add('arr-vis');

            const arrBorders = document.createElement('div');
            arrBorders.classList.add('arr-vis','arr-borders');

            for(let j = 0; j < cols; ++j) {
                const ele = document.createElement('span');
                ele.classList.add('arr-cell', 'no-border');
                ele.innerText = vals[i][j];
                arrVis.appendChild(ele);
                this.matrixBuffer[matrixIndex][i][j] = ele;

                const borderEle = document.createElement('span');
                borderEle.classList.add('arr-cell');
                arrBorders.appendChild(borderEle);
                if(hideInternalColumnBorders) {
                    borderEle.classList.add('dotted-internal-borders');
                }
            }
            arrBorders.lastChild.classList.add('last');
            arrVis.lastChild.classList.add('last');
            matrixContent.appendChild(arrVis);
            matrixBorders.appendChild(arrBorders);
        }
    }

    showMatrix(i) {
        this.allGraphsContainer.children.item(i).style.display = 'block';
    }
    
    hideMatrix(i) {
        this.allGraphsContainer.children.item(i).style.display = 'none';
    }

    rowLength(row, matrixIndex = 0) {
        return this.matrixBuffer[matrixIndex][row].length;
    }

    columnLength(col, matrixIndex = 0) {
        return this.matrixBuffer[matrixIndex].length;
    }

    readCell(row, col, matrixIndex = 0) {
        return +(this.matrixBuffer[matrixIndex][row][col].innerText);
    }

    readRow(row, matrixIndex = 0) {
        return +(this.matrixBuffer[matrixIndex][row].map(e => e.innerText).join(''));
    }

    writeRow(row, val, matrixIndex = 0) {
        const length = this.rowLength(row, matrixIndex);
        if((val + "").length > length) {
            throw Error("Value is too long to be written to the matrix row");
        }
        const eleVal = (val + "").padStart(length, '0').split('');
        for(let col = 0; col < length; ++col) {
            this.writeCell(row, col, eleVal[col] ,matrixIndex)
        }
    }

    writeCell(row, col, val, matrixIndex=0) {
        if((val + "").length > 1) {
            throw new Error("Value is too long to be written to the matrix cell")
        }

        this.matrixBuffer[matrixIndex][row][col].innerText = val;
    }

    clearRow(row, matrixIndex = 0) {
        this.writeRow(row, ''.padStart(this.rowLength(row, matrixIndex), ' '), matrixIndex);
    }

    copyMatrixFromTo(indexGraphI, indexGraphJ) {
        for(let row = 0; row < this.columnLength(0, indexGraphI); ++row) {
            for(let col = 0; col < this.rowLength(0, indexGraphI); ++col) {
                this.writeCell(row, col, this.readCell(row, col, indexGraphI), indexGraphJ);
            }
        }
    }


    _currentColumnHighlight = -1;
    highlightColumn(col, color, matrixIndex = 0) {
        this._currentColumnHighlight = col;
        for(let i = 0; i < this.columnLength(col, matrixIndex); ++i) {
            this.highlightCell(i, col, color, matrixIndex);
        }
    }

    deHighlightAll(matrixIndex = -1) {
        if(matrixIndex === -1) {
            for(let i = 0; i < this.matrixBuffer.length; ++i) {
                this.deHighlightAll(i);
            }
            return;
        }
        for(let col = 0; col < this.columnLength(0, matrixIndex); ++col) {
            this.highlightColumn(col, 'transparent', matrixIndex);
        }
        this._currentColumnHighlight = -1;
    }

    highlightAll(color, matrixIndex = 0) {
        for(let col = 0; col < this.columnLength(0, matrixIndex); ++col) {
            this.highlightColumn(col, color, matrixIndex);
        } 
    }

    highlightCell(i,j, color, matrixIndex = 0) {
        $(this.matrixBuffer[matrixIndex][i][j]).css('background-color', color);
    }

    highlightRow(row, color, matrixIndex = 0, doNotOverwriteColumnHighlight = true) {
        for(let i = 0; i < this.rowLength(row, matrixIndex); ++i) {
            if(doNotOverwriteColumnHighlight && i == this._currentColumnHighlight) {
                continue;
            }
            this.highlightCell(row, i, color, matrixIndex);
        }
    }

    deHighlightRow(row, matrixIndex = 0, doNotOverwriteColumnHighlight = true) {
        this.highlightRow(row, 'transparent', matrixIndex, doNotOverwriteColumnHighlight);
    }

    async swapRows(i,j, indexGraphI = 0, indexGraphJ = 0, duration=this.animationSpeed, animate=true) {
        disableAllButtons();
        
        const cellsI = this.allGraphsContainer.children.item(indexGraphI).lastChild.children.item(i);
        const cellsJ = this.allGraphsContainer.children.item(indexGraphJ).lastChild.children.item(j);
    
        const children1 = $(cellsI).children();
        cellsI.replaceChildren(...cellsJ.children);
        cellsJ.replaceChildren(...children1);

        const row1 = this.matrixBuffer[indexGraphI][i];
        this.matrixBuffer[indexGraphI][i] = this.matrixBuffer[indexGraphJ][j];
        this.matrixBuffer[indexGraphJ][j] = row1;
    
        if(animate) {
            await this._swapAnimationBetween(cellsI, cellsJ, duration)
        }
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
}