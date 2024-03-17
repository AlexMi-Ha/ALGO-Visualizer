function createListElement(val) {
    const li = document.createElement("li");
    li.classList.add('js-bar-cell');
    const span = document.createElement("span");
    span.classList.add('js-bar');
    span.style.height = (val / maxVal * height) + "px";
    const textSpan = document.createElement("span");
    textSpan.classList.add('js-bar-text');
    textSpan.innerText = val === 0 ? '' : val;

    li.appendChild(span);
    span.appendChild(textSpan);
    return li;
}

function createIndexElement(val) {
    const li = document.createElement("li");
    li.classList.add('js-bar-cell-index');
    const span = document.createElement("span");
    span.classList.add('js-index');
    const textSpan = document.createElement("span");
    textSpan.classList.add('js-bar-text');
    textSpan.innerText = val;

    li.appendChild(span);
    span.appendChild(textSpan);
    return li;
}



class BarGraphVisualizer extends Visualizer {

    constructor(container, array, hideBarsOnStartup = [], showBarsOnSameLine = [], showReset = false) {
        super();
        this.initContainer = container;
        this.reset(container, array, hideBarsOnStartup, showBarsOnSameLine, showReset);
    }

    async shuffle() {
        await shuffleLinearArrayAnimated();
    }

    reset(container, array, hideBarsOnStartup, showBarsOnSameLine, showReset) {
        container.innerHTML = '';
        this.graph = new Array(array.length);
        const allGraphsContainer = document.createElement('div');
        allGraphsContainer.classList.add('allgraphs-container');
        container.appendChild(allGraphsContainer);

        for(let i = 0; i < array.length; ++i) {
            const graphContainer = document.createElement('div');
            graphContainer.classList.add('graphContainer');
            $(allGraphsContainer).append(graphContainer);
            this.graph[i] = $(this.initArray(graphContainer, array[i]));
        }
        for(const bar of hideBarsOnStartup) {
            this.hideBar(bar);
        }
        super.addControls(container, showReset, () => this.reset(container, array, hideBarsOnStartup, showBarsOnSameLine, showReset));
    }

    // construction

    initArray(container, array) {
        const graph = document.createElement("ul");
        graph.classList.add('js-bar-graph');
    
        container.appendChild(graph);
    
        for(let i = 0; i < array.length; ++i) {
            $(graph).append(createListElement(array[i]));
        }
        for(let i = 0; i < array.length; ++i) {
            $(graph).append(createIndexElement(i+1));
        }

        return graph;
    }

    showMetadata(metadataObj) {
        this.metaDataContainer = document.createElement('div');
        this.metaDataContainer.classList.add('metadata-container');
        this.initContainer.appendChild(this.metaDataContainer);
        this.metaDataBuffer = {};
        for(const metaKeyText of Object.keys(metadataObj)) {
            const metaEle = document.createElement('p');
            metaEle.classList.add('metadata-element');
            
            const metaKey = document.createElement('span');
            metaKey.classList.add('metadata-key');
            metaKey.innerText = metaKeyText;

            const metaSeperator = document.createTextNode(':');

            const metaValue = document.createElement('span');
            metaValue.classList.add('metadata-value');
            metaValue.innerText = metadataObj[metaKeyText];

            metaEle.appendChild(metaKey);
            metaEle.appendChild(metaSeperator);
            metaEle.appendChild(metaValue);
            this.metaDataContainer.appendChild(metaEle);
            this.metaDataBuffer[metaKeyText] = metaValue;
        }
    }

    updateMetadata(dataPoint, value) {
        if(!this.metaDataBuffer) {
            return;
        }
        if(!this.metaDataBuffer[dataPoint]) {
            return;
        }

        this.metaDataBuffer[dataPoint].innerText = value;
    }

    removeMetadata() {
        this.metaDataBuffer = undefined;
        this.initContainer.removeChild(this.metaDataContainer);
        this.metaDataContainer = undefined;
    }

    hideBar(barIndex) {
        $(this.graph[barIndex]).css('display', 'none');
    }

    showBar(barIndex) {
        $(this.graph[barIndex]).css('display', 'initial')
    }

    // element manipulation

    async copyValueFromTo(i, j, indexGraphI = 0, indexGraphJ = 0) {
        const barsI = this.graph[indexGraphI].children('.js-bar-cell');
        const val = this.getValueAt(i, indexGraphI);
        $(barsI[i]).addClass('low-opac');
        await this.setValueAt(j, val, indexGraphJ);
        $(barsI[i]).removeClass('low-opac');
    }

    async swap(i,j, indexGraphI = 0, indexGraphJ = 0, duration=this.animationSpeed, animate=true) {
        disableAllButtons();
        
        const barsI = this.graph[indexGraphI].children('.js-bar-cell');
        const barsJ = this.graph[indexGraphJ].children('.js-bar-cell');
    
        const children1 = $(barsI[i]).children()[0];
        barsI[i].replaceChildren($(barsJ[j]).children()[0]);
        barsJ[j].replaceChildren(children1);
    
        if(animate) {
            await this._swapAnimationBetween(barsI[i], barsJ[j], duration)
        }
        if(!animating) {
            disableAllButtons(false);
        }
    }

    async moveFromTo(i,j, indexGraphI = 0, indexGraphJ = 0, direction = 1, duration= this.animationSpeed, animate = true) {
        disableAllButtons();

        const barsI = this.graph[indexGraphI].children('.js-bar-cell');
        const barsJ = this.graph[indexGraphJ].children('.js-bar-cell');

        if(animate) {
            await this._moveToAnimation(barsI[i], barsJ[j], duration, direction);
        }
        if(!animating) {
            disableAllButtons(false);
        }
    }

    resetTransforms(i, indexGraphI = 0) {
        const barsI = this.graph[indexGraphI].children('.js-bar-cell');

        $(barsI[i]).css('transform', `translate(0px,0px)`);
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

    async _moveToAnimation(ele1, ele2, duration, direction) {
        const offset1 = getElementOffset(ele1);
        const offset2 = getElementOffset(ele2);

        const xMax = offset2.left - offset1.left;
        const yMax = offset2.top - offset1.top;
        if(direction === -1) {
            $(ele1).css('transform', `translate(${xMax}px, ${yMax}px)`);
        }
        $(ele1).addClass('low-opac');
        await $({x:0}).animate({x:1}, {
            duration: duration,
            step: function(val) {
                const posX1 = direction === -1 ? xMax - xMax*val : xMax*val;
                const posY1 = direction === -1 ? yMax - yMax * val : yMax*val;

                $(ele1).css('transform', `translate(${posX1}px, ${posY1}px)`);
            },
            done: () =>{
                $(ele1).removeClass('low-opac');
            }
        }).promise();
    }

    async setValueAt(i, val, indexOfGraph = 0, duration = this.animationSpeed, animate= true) {
        disableAllButtons();
        const bars = this.graph[indexOfGraph].children('.js-bar-cell');

        const currentVal = this.getValueAt(i, indexOfGraph);
        bars[i].firstChild.firstChild.innerText = val === 0 ? '' : val;
        $(bars[i]).addClass('low-opac');

        if(!animate) {
            duration = 0;
        }
        await $({y:currentVal}).animate({y:val}, {
            step: (s) => $(bars[i].firstChild).css('height', (s/maxVal * height) + "px"),
            duration: duration,
            done: () => $(bars[i]).removeClass('low-opac')
        }).promise();

        if(!animating) {
            disableAllButtons(false);
        }
    }
    
    getValueAt(i, indexOfGraph = 0) {
        const bars = this.graph[indexOfGraph].children('.js-bar-cell');
        return +bars[i].firstChild.firstChild.innerText;
    }
    compare(i,j, indexGraphI = 0, indexGraphJ = 0) {  
        const val1 = this.getValueAt(i, indexGraphI);
        const val2 = this.getValueAt(j, indexGraphJ);
    
        return val1 - val2;
    }


    // Highlighting

    highlight(i, color, indexOfGraph = 0) {
        const bars = this.graph[indexOfGraph].children('.js-bar-cell');
    
        $(bars[i].firstChild).css('background-color', color)
    }
    
    deHighlight(i, indexOfGraph = 0) {
        this.highlight(i, "blue", indexOfGraph);
    }
    
    deHighlightAll(indexOfGraph = 0) {
        this.highlightAll("blue", indexOfGraph);
    }
    
    highlightAll(color, indexOfGraph = 0) {
        const l = this.length();
        for(let i = 0; i < l; ++i) {
            this.highlight(i, color, indexOfGraph);
        }
    }

    highlightIndex(i, highlightText = 'i', deHighlightAllFirst = true, indexOfGraph = 0) {
        const indexes = this.graph[indexOfGraph].children('.js-bar-cell-index');
        if(deHighlightAllFirst) {
            this.deHighlightAllIndexes(indexOfGraph, indexes);
        }
        indexes[i].classList.add('highlighted-index');
        indexes[i].firstChild.setAttribute('js-index-highlight', highlightText);
    }
    
    deHighlightAllIndexes(indexOfGraph = 0, indexes = undefined) {
        indexes ??= this.graph[indexOfGraph].children('.js-bar-cell-index');
        for(const index of indexes) {
            index.classList.remove('highlighted-index');
            index.firstChild.removeAttribute('js-index-highlight');
        }
    }
    
    deHighlightIndex(i, indexOfGraph = 0) {
        const indexes = this.graph[indexOfGraph].children('.js-bar-cell-index');
        indexes[i].classList.remove('highlighted-index');
        indexes[i].firstChild.removeAttribute('js-index-highlight');
    }
    
    length(indexOfGraph = 0) {
        return this.graph[indexOfGraph].children('.js-bar-cell').length;
    }
}