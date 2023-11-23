
class Visualizer {
    constructor(logContainer) {
        if (new.target == Visualizer) {
            throw new TypeError("Cannot create an instance of an abstract super class");
        }

        this.logContainer = logContainer
    }

    show() {
        throw new Error("show() must be implemented by the sub class");
    }

    async delay(duration = speedSlider.value) {
        await sleep(duration);
    }

    log(text, level = 0) {
        if (level == 0) {
            this.logContainer.log(text);
        } else {
            this.logContainer.logError(text);
        }
    }

    clearLogs() {
        this.logContainer.clear();
    }
}

const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));