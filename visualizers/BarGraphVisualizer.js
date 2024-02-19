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


class BarGraphVisualizer extends Visualizer {

    constructor(container, array) {
        super();
        this.graph = new Array(array.length);
        for(let i = 0; i < array.length; ++i) {
            const graphContainer = document.createElement('div');
            graphContainer.classList.add('graphContainer');
            $(container).append(graphContainer);
            this.graph[i] = $(this.initArray(graphContainer, array[i]));
        }
        super.addControls(container);
    }

    // construction

    initArray(container, array) {
        const graph = document.createElement("ul");
        graph.classList.add('js-bar-graph');
    
        container.appendChild(graph);
    
        for(let i = 0; i < array.length; ++i) {
            $(graph).append(createListElement(array[i]));
        }

        return graph;
    }

    // element manipulation

    async copyValueFromTo(i, j, indexGraphI = 0, indexGraphJ = 0) {
        const barsI = this.graph[indexGraphI].children('.js-bar-cell');
        const val = this.getValueAt(i, indexGraphI);
        $(barsI[i]).addClass('low-opac');
        await this.setValueAt(j, val, indexGraphJ);
        $(barsI[i]).removeClass('low-opac');
    }

    async swap(i,j, indexGraphI = 0, indexGraphJ = 0, duration=1000, animate=true) {
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

    async moveFromTo(i,j, indexGraphI = 0, indexGraphJ = 0, direction = 1, duration= 1000, animate = true) {
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
        await Promise.all([this._moveToAnimation(ele1, ele2, duration, -1),
        this._moveToAnimation(ele2, ele1, duration, -1)]);
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

    async setValueAt(i, val, indexOfGraph = 0, duration = 500, animate= true) {
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
    
    length(indexOfGraph = 0) {
        return this.graph[indexOfGraph].children('.js-bar-cell').length;
    }
}