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

    constructor(container) {
        super();
        this.graph = $(this.initArray(container));
    }

    // construction

    initArray(container) {
        const graph = document.createElement("ul");
        graph.classList.add('js-bar-graph');
    
        container.appendChild(graph);
    
        for(let i = 1; i <= maxVal; ++i) {
            $(graph).append(createListElement(i));
        }

        super.addControls(container);
        return graph;
    }

    // element manipulation

    async copyValueFromTo(i, j) {
        const bars = this.graph.children('.js-bar-cell');
        const val = this.getValueAt(i);
        $(bars[i]).addClass('low-opac');
        await this.setValueAt(j, val);
        $(bars[i]).removeClass('low-opac');
    }

    async swap(i,j, duration=1000, animate=true) {
        disableAllButtons();
        const bars = this.graph.children('.js-bar-cell');
        
        const smaller = Math.min(i,j);
        const bigger = Math.max(i,j);
        const distance = (bigger - smaller) * width;
    
        const children1 = $(bars[smaller]).children()[0];
        bars[smaller].replaceChildren($(bars[bigger]).children()[0]);
        bars[bigger].replaceChildren(children1);
    
        if(animate) {
            $(bars[smaller]).css('transform', `translateX(${distance}px)`).addClass('low-opac');
            $(bars[bigger]).css('transform', `translateX(-${distance}px)`).addClass('low-opac');
            await $({x:0}).animate({x:1}, {
                duration: duration,
                step: function(val) {
                    const pos = distance - distance * val;
                    $(bars[smaller]).css('transform', `translateX(${pos}px)`);
                    $(bars[bigger]).css('transform', `translateX(-${pos}px)`);
                },
                done: () =>{
                    $(bars[smaller]).removeClass('low-opac');
                    $(bars[bigger]).removeClass('low-opac');
                }
            }).promise();
        }
        if(!animating) {
            disableAllButtons(false);
        }
    }

    async setValueAt(i, val, duration = 500, animate= true) {
        disableAllButtons();
        const bars = this.graph.children('.js-bar-cell');

        const currentVal = this.getValueAt(i);
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
    
    getValueAt(i) {
        const bars = this.graph.children('.js-bar-cell');
        return +bars[i].firstChild.firstChild.innerText;
    }
    compare(i,j) {
        const bars = this.graph.children('.js-bar-cell');
    
        const val1 = this.getValueAt(i);
        const val2 = this.getValueAt(j);
    
        return val1 - val2;
    }


    // Highlighting

    highlight(i, color) {
        const bars = this.graph.children('.js-bar-cell');
    
        $(bars[i].firstChild).css('background-color', color)
    }
    
    deHighlight(i) {
        this.highlight(i, "blue");
    }
    
    deHighlightAll() {
        this.highlightAll("blue");
    }
    
    highlightAll(color) {
        const l = this.length();
        for(let i = 0; i < l; ++i) {
            this.highlight(i, color);
        }
    }
    
    length() {
        return this.graph.children('.js-bar-cell').length;
    }
}