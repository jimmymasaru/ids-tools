import fs from "fs";

export async function read(filename: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

export async function write(writer: NodeJS.WritableStream, content: string) {
    return new Promise((resolve, reject) => {
        writer.on('error', reject);
        if (writer === process.stdout) {
            writer.on('drain', resolve);
        } else {
            writer.on('close', resolve);
        }
        writer.write(content);
        writer.end();
    });
}

export async function mkdir(dir: string) {
    return new Promise<void>((resolve, reject) => {
        fs.exists(dir, exists => {
            if (exists) {
                fs.stat(dir, (err, stats) => {
                    if (stats.isDirectory()) {
                        resolve();
                    } else {
                        reject(Error('File exists and is not a directory.'))
                    }
                });
            } else {
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

export async function exists(filename: string) {
    return new Promise((resolve, reject) => {
        fs.exists(filename, exists => {
            if (exists)
                resolve(true);
            else
                reject();
        })
    })
}
