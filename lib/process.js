'use strict';
const stream = require('stream');

/**
 * 
 * @param {*} command 
 * @param {*} args 
 * @param {*} cwd 
 * @param {boolean} supress Supress writing to stdout or stderr
 */
function run(command, args, cwd, supress) {
    return new Promise((resolve, reject) => {
        let spawn = require('child_process').spawn;
        let options = {};
        let result = '', err = '';
        if (cwd)
            options.cwd = cwd;
        let child = spawn(command, args, options);
        child.stdout.on('data', data => {
            result += data;
            if (!supress)
                process.stdout.write(data);
        });
        child.stderr.on('data', data => {
            err += data;
            if (!supress)
                process.stderr.write(data);
        });
        child.on('close', (code, signal) => {
            if (code == 0)
                resolve(result, err);
            else
                reject(result, err);
        });
        child.on('error', err => {
            process.stderr.write(err);
            reject('', err);
        });
    });
}

module.exports = {
    run,
    run2: run
}
