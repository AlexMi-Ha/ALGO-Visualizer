let stepButton;
let animateButton;
let pauseButton;
let shuffleButton;
let startButton;
let resetButton;

function disableAllButtons(val = true) {
    startButton.disabled = val;
    shuffleButton.disabled = val;
    stepButton.disabled = val;
    animateButton.disabled = val;
}

let animating = false;

function getElementOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

MAX_SPEED = 20;
MIN_SPEED = 2000;

class Visualizer {

    showResetButton() {
        resetButton.style.display = 'inline';
    }

    addControls(container, showReset = false, resetFunction = undefined) {
        const controlContainer = document.createElement('div');
        controlContainer.classList.add('control-container');
        controlContainer.style.textAlign = 'center';
        container.appendChild(controlContainer);
       
        this.addShuffleButton(controlContainer);
        this.addStartButton(controlContainer, showReset);
        this.addStepButton(controlContainer);
        this.addPauseButton(controlContainer);
        this.addAnimateButton(controlContainer);
        if(showReset) {
            this.addResetButton(controlContainer, resetFunction);
        }
        this.addSpeedSlider(controlContainer);
        
        this.addLoggingContainer(container);

    }

    addSpeedSlider(container) {
        const label = document.createElement('label');
        label.htmlFor = 'speed-slider';
        label.innerHTML = 'Adjust Speed: (x<span id="speedlabelvalue"></span>)'
        label.id = 'speed-slider-label';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id='speed-slider';
        container.appendChild(label);
        container.appendChild(slider);
        
        const sliderToAnimationSpeedMapper = (val) => (MAX_SPEED-MIN_SPEED) * val / 100 + MIN_SPEED
        const speedLabel = document.getElementById('speedlabelvalue');
        const sliderEvent = () => {
            this.animationSpeed = sliderToAnimationSpeedMapper(slider.value);
            const label = ((sliderToAnimationSpeedMapper(50) / this.animationSpeed) + "").substring(0,3);
            speedLabel.innerText = label.endsWith('.') ? label.substring(0,2) : label;
        }

        slider.addEventListener('input', sliderEvent);
        slider.value = 50;
        sliderEvent();
    }

    addResetButton(container, resetFunction) {
        resetButton = document.createElement("button");

        resetButton.innerText = "Reset";
        resetButton.id = 'btn-reset';
        resetButton.style.display = 'none';
        resetButton.classList.add("button", "btn", "btn-outline-dark");
        container.appendChild(resetButton);
        resetButton.addEventListener('click', () => {
            animating = false;
            resetFunction();
        });
    }

    addAnimateButton(container) {
        animateButton = document.createElement("button");
        animateButton.innerText = "Animate";
        animateButton.id = 'btn-animate';
        animateButton.style.display = 'none';
        animateButton.classList.add("button", "btn", "btn-outline-dark");
        container.appendChild(animateButton);
    }
    
    addPauseButton(container) {
        pauseButton = document.createElement("button");
        pauseButton.innerText = "Pause";
        pauseButton.id = 'btn-pause';
        pauseButton.style.display = 'none';
        pauseButton.classList.add("button", "btn", "btn-outline-dark");
        pauseButton.addEventListener('click', () => {
            stepButton.style.display = 'initial';
            pauseButton.style.display = 'none';
            animating = false;
        })
        container.appendChild(pauseButton);
    }

    addStepButton(container) {
        stepButton = document.createElement("button");
        stepButton.innerText = "Step";
        stepButton.id = 'btn-step';
        stepButton.style.display = 'none';
        stepButton.classList.add("button", "btn", "btn-outline-dark");
        container.appendChild(stepButton);
    }

    addStartButton(container, showReset) {
        startButton = document.createElement("button");
        startButton.innerText = "Start";
        startButton.id = 'btn-start';
        startButton.classList.add("button", "btn", "btn-outline-dark");
        container.appendChild(startButton);

        startButton.addEventListener('click', async () => {
            animating = false;
            this.deHighlightAll();
            stepButton.style.display = 'initial';
            animateButton.style.display = 'initial';
            pauseButton.style.display = 'none';
            startButton.style.display = 'none';
            shuffleButton.style.display = 'none';

            await currentAlgorithm();
            
            if(showReset) {
                this.showResetButton();
            }else {
                startButton.style.display = 'initial';
                shuffleButton.style.display = 'initial';
            }
            stepButton.style.display = 'none';
            animateButton.style.display = 'none';
            pauseButton.style.display = 'none';
            disableAllButtons(false);
        });
    }

    addShuffleButton(container) {
        shuffleButton = document.createElement("button");
        shuffleButton.innerText = "Shuffle";
        shuffleButton.id = 'btn-shuffle';
        shuffleButton.classList.add("button", "btn", "btn-outline-dark");
        container.appendChild(shuffleButton);

        shuffleButton.addEventListener('click', async () => {
            disableAllButtons();

            await this.shuffle();

            disableAllButtons(false);
        });
    }

    addLoggingContainer(rootContainer) {
        const div = document.createElement('div');
        div.id = 'log-container';
        rootContainer.appendChild(div);

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-container');

        const info = document.createElement('span');
        info.innerText = "i";
        info.classList.add('info-icon');
        div.appendChild(infoContainer);
        infoContainer.appendChild(info);

        this.logContainer = document.createElement('p');
        this.logContainer.classList.add('log-text');
        div.appendChild(this.logContainer);
    }

    log(message) {
        if(!this.logContainer) {
            return;
        }
        this.logContainer.parentElement.style.display = 'grid';
        this.logContainer.innerText = message;
    }

    clearLog() {
        if(!this.logContainer) {
            return;
        }
        this.logContainer.parentElement.style.display = 'none';
        this.logContainer.innerText = '';
    }

    sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));
    buttonClick = () => new Promise(resolve => {
        stepButton.onclick = resolve;
        animateButton.onclick = () => {
            animating = true;
            disableAllButtons();
            stepButton.style.display = 'none';
            pauseButton.style.display = 'initial';
            resolve();
        }
    });

    async delay(sleepDuration = this.animationSpeed) {
        if (animating) {
            await this.sleep(sleepDuration)
            return;
        }
        disableAllButtons(false);
        await this.buttonClick();
    }
}