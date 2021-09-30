'use strict';
import {SpawnOptionsWithoutStdio} from "child_process";
import {URL} from "url";

/**
 *
 * @param {*} command
 * @param {*} args
 * @param {*} cwd
 * @param {boolean} supress Supress writing to stdout or stderr
 */
export default function run(command: string, args: string[], cwd: string | URL | undefined, supress: boolean): Promise<RunResult> {
    return new Promise<RunResult>((resolve, reject) => {
        let spawn = require('child_process').spawn;
        let options: SpawnOptionsWithoutStdio = {};
        let result = '', err = '';
        if (cwd) {
            options.cwd = cwd
        }
        let child = spawn(command, args, options);
        child.stdout.on('data', (data: any) => {
            result += data;
            if (!supress)
                process.stdout.write(data);
        });
        child.stderr.on('data', (data: any) => {
            err += data;
            if (!supress)
                process.stderr.write(data);
        });
        child.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
            if (code == 0)
                resolve({result, error: err});
            else
                reject({result, error: err});
        });
        child.on('error', (err: any) => {
            process.stderr.write(err);
            reject({result: '', error: err});
        });
    });
}

export type RunResult = {
    result: string;
    error: string;
}
