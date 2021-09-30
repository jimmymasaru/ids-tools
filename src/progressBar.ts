'use strict';

export default class ProgressBar {
    private value: number;
    private stepsPerBlock: number;
    private mute: boolean;

    /**
     * Show a simple progress bar
     * @param {number} stepsPerBlock How many steps equal to one square block
     * @param {boolean} suppressStdout If the progress bar should mute
     */
    constructor(stepsPerBlock: number, suppressStdout: boolean) {
        this.value = 0;
        this.stepsPerBlock = stepsPerBlock;
        this.mute = suppressStdout;
    }

    step() {
        this.value++;
        if (Number.isInteger(this.value / this.stepsPerBlock) && !this.mute) {
            process.stdout.write('█');
        }
    }

    finish() {
        if (!this.mute) {
            process.stdout.write('\n');
        }
        this.reset();
    }

    reset() {
        this.value = 0;
    }

    suppressStdout(suppress: boolean) {
        this.mute = suppress;
    }
}
