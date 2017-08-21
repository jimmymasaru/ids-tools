'use strict';
const fs = require('fs');

async function read(filename) {
    return new Promise((resolve, reject) => {
        let reader = fs.readFile(filename, 'utf8', (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

async function write(writer, content) {
    return new Promise((resolve, reject) => {
        writer.on('error', reject);
        if (writer == process.stdout) {
            writer.on('drain', resolve);
        } else {
            writer.on('close', resolve);
        }
        writer.write(content);
        writer.end();
    });
}

async function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.exists(dir, exists => {
            if (exists) {
                fs.stat(dir, (err, stats) => {
                    if (stats.isDirectory) {
                        // dir exists
                        resolve();
                    } else {
                        reject(Error('File exists and is not a directory.'))
                    }
                });
            }
            else {
                fs.mkdir(dir, err => {
                    if (err)
                        reject(err)
                    else
                        resolve();
                })
            }
        })
    })
}

async function exists(filename) {
    return new Promise((resolve, reject) => {
        fs.exists(filename, exists => {
            if (exists)
                resolve(true);
            else
                reject();
        })
    })
}

module.exports = {
    mkdir,
    read,
    write,
    exists
}
