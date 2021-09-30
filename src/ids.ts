'use strict';

export function parseEntry(char: string, segments: string[]): Entry | null {
    if (char == null) {
        return null;
    }
    let idsList: IDS[] = [];
    segments.forEach(segment => {
        var matches = segment.match(/^(.+?)(\[([A-Z]+)\])?$/);
        var idsString = matches && matches[1] ? matches[1] : null;
        var regionGroup = matches && matches[3] ? matches[3] : null;
        if (idsString != null) {
            try {
                let ids = parseIDS([...idsString], regionGroup);
                if (ids) {
                    idsList.push(ids);
                }
            } catch (e) {
                if (e instanceof Error) {
                    process.stderr.write(e.message);
                }
            }
        }
    });
    if (idsList.length) {
        return new Entry(char, idsList);
    }
    return null;
}

// function iterableIdsString(idsString, noCdp) {
//     let iterator = {
//         next: function () {
//             if (idsString.length == 0)
//                 return {done: true};
//             else {
//                 let matches = idsString.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\&.*?\;|.)/);
//                 let result = matches[1];
//                 idsString = idsString.substring(result.length);
//                 return {value: result, done: false};
//             }
//         }
//     }
//     let obj = {};
//     obj[Symbol.iterator] = () => iterator;
//     return obj;
// }

function parseIDS(entities: string[], regionGroup: string | null): IDS {
    let firstEntity = entities.shift() as string;
    if (/^[\u2FF0-\u2FFF]$/.test(firstEntity)) {
        let idc = firstEntity, operands: IDS[] = [], arity = 0;
        if (~'⿰⿱⿴⿵⿶⿷⿸⿹⿺⿻'.indexOf(idc)) {
            arity = 2;
        } else if (~'⿲⿳'.indexOf(idc)) {
            arity = 3;
        } else {
            throw new Error('Unsupported IDC: ' + idc);
        }
        for (let i = 0; i < arity; i++) {
            let operand = parseIDS(entities, regionGroup);
            operands.push(operand);
        }
        return new IDS(idc, operands, regionGroup);
    } else {
        return new IDS('atomic', [firstEntity], regionGroup);
    }
}

export class Entry {
    readonly char: string;
    readonly idsList: IDS[];
    readonly isAtomic: boolean = false;

    constructor(char: string, idsList: IDS[]) {
        this.char = char;
        this.idsList = idsList;
        if (idsList[0].descriptor === 'atomic')
            this.isAtomic = true;
    }

    toJSON() {
        return {c: this.char, l: this.idsList};
    };
}

export class IDS {
    readonly descriptor: string;
    readonly operands: (IDS | string)[];
    readonly regionGroup: string | null;

    constructor(idc: string, operands: (IDS|string)[], regionGroup: string | null) {
        this.descriptor = idc;
        this.operands = operands;
        this.regionGroup = regionGroup;
        // var decomposed = false;
        //   function isDecomposed() {
        //     if (arguments.length == 0)
        //         return decomposed;
        //     else
        //         decomposed = value;
        // };
    }

    toJSON() {
        return {
            d: this.descriptor,
            o: this.operands,
            r: this.regionGroup
        }
    }

    valueOf() {
        return this.descriptor + this.operands.reduce((prev, curr) => '' + prev + curr);
    }

    toString() {
        return this.descriptor + this.operands.reduce((prev, curr) => '' + prev + curr);
    };
}

/**
 * Copied from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt#Fixing_charCodeAt()_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_known
 * @param {*} str
 * @param {*} idx
 */

function knownCharCodeAt(str: any, idx: any) {
    str += '';
    var code,
        end = str.length;

    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    while ((surrogatePairs.exec(str)) != null) {
        var li = surrogatePairs.lastIndex;
        if (li - 2 < idx) {
            idx++;
        } else {
            break;
        }
    }

    if (idx >= end || idx < 0) {
        return NaN;
    }

    code = str.charCodeAt(idx);

    var hi, low;
    if (0xD800 <= code && code <= 0xDBFF) {
        hi = code;
        low = str.charCodeAt(idx + 1);
        // Go one further, since one of the "characters"
        // is part of a surrogate pair
        return ((hi - 0xD800) * 0x400) +
            (low - 0xDC00) + 0x10000;
    }
    return code;
}
