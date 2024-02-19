let stepButton;
let animateButton;
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


class Visualizer {

    showResetButton() {
        resetButton.style.display = 'inline';
    }

    addControls(container, showReset = false, resetFunction = undefined) {
        const controlContainer = document.createElement('div');
        controlContainer.classList.add('control-container');
        container.appendChild(controlContainer);

        shuffleButton = document.createElement("button");
        startButton = document.createElement("button");
        stepButton = document.createElement("button");
        animateButton = document.createElement("button");
        if (showReset) {
            resetButton = document.createElement("button");
        }

        shuffleButton.innerText = "Shuffle";
        startButton.innerText = "Start";
        stepButton.innerText = "Step";
        animateButton.innerText = "Animate";
        
        shuffleButton.id = 'btn-shuffle';
        startButton.id = 'btn-start';
        stepButton.id = 'btn-step';
        animateButton.id = 'btn-animate';
        stepButton.style.display = 'none';
        animateButton.style.display = 'none';

        
        controlContainer.appendChild(shuffleButton);
        controlContainer.appendChild(startButton);
        controlContainer.appendChild(stepButton);
        controlContainer.appendChild(animateButton);

        if(showReset) {
            resetButton.innerText = "Reset";
            resetButton.id = 'btn-reset';
            resetButton.style.display = 'none';
            controlContainer.appendChild(resetButton);
            resetButton.addEventListener('click', () => {
                animating = false;
                resetFunction();
            });
        }

        startButton.addEventListener('click', async () => {
            animating = false;
            this.deHighlightAll();
            stepButton.style.display = 'initial';
            animateButton.style.display = 'initial';
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
            disableAllButtons(false);
        });
        shuffleButton.addEventListener('click', async () => {
            disableAllButtons();

            await shuffleArrayAnimated();

            disableAllButtons(false);
        });
    }


    sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));
    buttonClick = () => new Promise(resolve => {
        stepButton.onclick = resolve;
        animateButton.onclick = () => {
            animating = true;
            disableAllButtons();
            resolve();
        }
    });

    async delay(sleepDuration = 100) {
        if (animating) {
            await this.sleep(sleepDuration)
            return;
        }
        await this.buttonClick();
    }
}