function createListElement(val) {
    const li = document.createElement("li");
    li.classList.add('js-bar-cell');
    const span = document.createElement("span");
    span.classList.add('js-bar');
    span.style.height = (val / maxVal * height) + "px";
    const textSpan = document.createElement("span");
    textSpan.classList.add('js-bar-text');
    textSpan.innerText = val;

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

    async setValueAt(i, val, indexOfGraph = 0, duration = 500, animate= true) {
        disableAllButtons();
        const bars = this.graph[indexOfGraph].children('.js-bar-cell');

        const currentVal = this.getValueAt(i, indexOfGraph);
        bars[i].firstChild.firstChild.innerText = val;
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