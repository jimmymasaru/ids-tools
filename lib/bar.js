'use strict';

/**
 * Show a simple progress bar
 * @param {number} blockSteps How many steps equal to one square block
 * @param {boolean} suppressStdout If the progress bar should mute
 */
function progressBar(blockSteps, suppressStdout) {
    var value = 0;
    var mute = !!suppressStdout;
    this.step = function () {
        value++;
        if (Number.isInteger(value / blockSteps) && !mute) {
            process.stdout.write('█');
        }
    }
    this.finish = function () {
        if (!mute)
            process.stdout.write('\n');
        this.reset();
    }
    this.reset = function () {
        value = 0;
    }
    this.suppressStdout = function (suppress) {
        mute = suppress;
    }
}

module.exports = progressBar;
