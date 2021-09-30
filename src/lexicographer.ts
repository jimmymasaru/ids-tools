import fs from "fs";
import ProgressBar from "./progressBar";
import {Arguments} from "./dictGenerator";
import readline from "readline";
import {Entry, IDS, parseEntry} from "./ids";

export default class Lexicographer {
    private argv: Arguments;
    private entries: Entry[] = [];
    private pb: ProgressBar;
    private components = [];

    constructor(argv: Arguments) {
        this.argv = argv;
        this.pb = new ProgressBar(500, false);
    }

    async run() {
        let readLinesPromise = new Promise((resolve, reject) => {
            let reader = readline.createInterface({
                input: this.argv._[0] ? fs.createReadStream(this.argv._[0] as string).on('error', reject) : process.stdin
            });
            let pb = this.pb;
            let parseLine = Lexicographer.parseLine;
            let entries = this.entries;
            reader.on('line', line => {
                parseLine(line, entries);
                pb.step();
            });
            reader.on('close', resolve);
        });
        await readLinesPromise;
        this.pb.finish();
        let writeCharPromise = new Promise((resolve, reject) => {
            let writer = fs.createWriteStream(this.argv.char).on('error', reject);
            this.write(writer);
        });
        await writeCharPromise;
        this.pb.finish();
        // let writeCompPromise = new Promise((resolve, reject) => {
        //
        // });
        // await writeCompPromise;
        // this.pb.finish();
    }

    private static parseLine(line: string, entries: Entry[]) {
        // ignore comments or empty lines
        if (/^[;#\s]/.test(line)) {
            return;
        }
        let cols = line.split('\t');
        if (cols.length < 3) {
            return;
        }
        // let unicode = cols[0];
        let char = cols[1];
        let segments = cols.slice(2);
        let entry = parseEntry(char, segments);
        if (entry != null) {
            entries.push(entry);
        }
    }

    private write(writer: NodeJS.WritableStream) {
        for (let entry of this.entries) {
            try {
                // console.log(JSON.stringify(entry));
                if (!entry.isAtomic)
                    entry.idsList.forEach(ids => {
                        // this.decomposeIDS(ids);
                        // this.collectComponent(entry.char, ids);
                    });
                // console.log(JSON.stringify(entry));
                this.pb.step();
                writer.write(`${entry.char}\t${JSON.stringify(entry)}\n`);
            } catch (e) {
                console.error('\nAn error occurred for this entry\n' + JSON.stringify(entry));
            }
        }
    }

    // private decomposeIDS(ids: IDS) {
    //     let {descriptor, operands, regionGroup} = ids;
    //
    //     for(let operand in operands){
    //         if ( operand instanceof string) {
    //             // theoretically there should only be one matched result so we use 'find()' here to get only one result
    //             var matchedEntry = this.entries.find(entry => entry.char === operand);
    //             if (matchedEntry) {
    //                 if (!matchedEntry.isAtomic) {
    //                     operands[i] = matchedEntry;
    //                     operand = operands[i];
    //                     matchedEntry.idsList.forEach(item => {
    //                         if (!item.isDecomposed())
    //                             decomposeIDS(item);
    //                     });
    //                 }
    //             } else {
    //                 // cannot find. maybe it's a string and not exist. maybe it's an ids.
    //                 console.error(operand + ' not found.');
    //             }
    //         } else if (operand instanceof IDS) {
    //             if () {
    //                 decomposeIDS(operands[i]);
    //             } else if (operand instanceof idsLibrary.Entry) {
    //                 // already decomposed
    //             } else {
    //                 console.error('typeof operand returns ' + (typeof operand));
    //             }
    //         } else {
    //             console.error('typeof operand returns ' + (typeof operand));
    //         }
    //     }
    //     ids.isDecomposed(true);
    // }

    //
    // private collectComponent(char, ids) {
    //     if (typeof ids != 'object' || !ids instanceof idsLibrary.IDS) {
    //         console.error('Unexpected IDS: ' + ids);
    //         return;
    //     }
    //     var operands = ids.o;
    //     for (var i = 0; i < operands.length; i++) {
    //         var operand = operands[i];
    //         if (typeof operand == 'string') {
    //             addToComponentDict(operand, char);
    //         } else if (typeof operand == 'object') {
    //             if (operand instanceof idsLibrary.Entry) {
    //                 addToComponentDict(operand.char, char);
    //                 operand.idsList.forEach(item => collectComponent(char, item));
    //             } else if (operand instanceof idsLibrary.IDS) {
    //                 collectComponent(char, operand);
    //             } else {
    //                 console.error('typeof operand returns ' + (typeof operand));
    //             }
    //         } else {
    //             console.error('typeof operand returns ' + (typeof operand));
    //         }
    //     }
    // }
    //
    //
    // private addToComponentDict(component, char) {
    //     if (!components[component])
    //         components[component] = new Set();
    //     components[component].add(char);
    // }
    //
    // private writeComponents() {
    //     var keys = [];
    //     for (var key in components) {
    //         if (components.hasOwnProperty(key)) {
    //             keys.push(key);
    //         }
    //     }
    //     keys.sort();
    //     componentWriter(keys, 0);
    // }
    //
    // private componentWriter(keys, startIndex) {
    //     if (writer == null)
    //         writer = fs.createWriteStream(argv.comp).on('error', errExit);
    //     var i = startIndex;
    //     while (i < keys.length) {
    //         var component = keys[i];
    //         var chars = components[component];
    //         pb.step();
    //         var line = component + '\t';
    //         chars.forEach(char => line += char);
    //         line += '\n';
    //         writer.write(line);
    //         ++i;
    //         if (i >= keys.length) {
    //             // the last one has completed
    //             setImmediate(() => {
    //                 pb.finish();
    //                 writer.end('', () => {
    //                     writer = null;
    //                     successExit();
    //                 });
    //             });
    //         } else {
    //             setImmediate(componentWriter, keys, i);
    //             break;
    //         }
    //     }
    // }
}
