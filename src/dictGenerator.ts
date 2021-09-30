'use strict';
import yargs from "yargs";
import Lexicographer from "./lexicographer";

async function main() {
    let argv: Arguments = yargs(process.argv.slice(2))
        .scriptName("dictgen")
        .epilog('IDS Dictionary Generator\nCopyright (c) 2017-2021 Jimmy Page.')
        .options({
            char: {type: 'string', demandOption: true, description: "dict file name"},
            comp: {type: 'string', demandOption: true, description: "comp file name"}
        })
        .help()
        .usage('\nUsage:\n\
        |$0 <input>|stdin --char <char_dict_output> --comp <comp_dict_ourput> \n\
        |$0 ids-cdp.txt --char ids-dict.txt --comp ids-comp.txt'
            .replace(/^\s*\|/gm, ''))//g: global, m: multi-line mode
        .parseSync();

    var lexicographer = new Lexicographer(argv);
    try {
        await lexicographer.run();
        successExit();
    } catch (err) {
        errExit(err);
    }
}

function successExit() {
    process.exit(0);
}

function errExit(err: any) {
    process.stderr.write('An error has occurred. \n');
    if (err)
        process.stderr.write(err + '\n');
    process.exit(1);
}

export type Arguments = {
    char: string;
    comp: string;
    _: (string | number)[];
    $0: string;
}

main();
