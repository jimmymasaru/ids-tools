'use strict';

function getEntry(char, segments) {
    if (char == null)
        return null;
    var idsList = [];
    segments.forEach(segment => {
        var matches = segment.match(/^(.+?)(\[([A-Z]+)\])?$/);
        var idsString = matches && matches[1] ? matches[1] : null;
        var regionGroup = matches && matches[3] ? matches[3] : null;
        if (idsString != null) {
            try {
                var ids = analyseIDS(splitString(idsString), regionGroup);
                if (ids)
                    idsList.push(ids);
            } catch (e) {
                process.stderr.write(e);
            }
        }
    });
    if (idsList.length)
        return new Entry(char, idsList);
}

function splitString(idsString) {
    var entities = [];
    while (idsString.length > 0) {
        // split by surrogate pairs, private characters or unicode (BMP) characters
        var matches = idsString.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\&.*?\;|.)/);
        entities.push(matches[1]);
        idsString = idsString.substring(matches[1].length);
    }
    return entities;
}

function iterableIdsString(idsString, noCdp) {
    let iterator = {
        next: function () {
            if (idsString.length == 0)
                return { done: true };
            else {
                let matches = idsString.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|\&.*?\;|.)/);
                let result = matches[1];
                idsString = idsString.substring(result.length);
                return { value: result, done: false };
            }
        }
    }
    let obj = {};
    obj[Symbol.iterator] = () => iterator;
    return obj;
}

function analyseIDS(entities, regionGroup) {
    var firstEntity = entities.shift();
    if (/^[\u2FF0-\u2FFF]$/.test(firstEntity)) {
        var idc = firstEntity, operands = [], arity = 0;
        if (~'⿰⿱⿴⿵⿶⿷⿸⿹⿺⿻'.indexOf(idc))
            arity = 2;
        else if (~'⿲⿳'.indexOf(idc))
            arity = 3;
        else
            throw new Error('Unsupported IDC: ' + idc);
        for (var i = 0; i < arity; i++) {
            var operand = analyseIDS(entities, regionGroup);
            operands.push(operand);
        }
        return new IDS(idc, operands, regionGroup);
    } else {
        return firstEntity
    }
}

function Entry(char, idsList, regionGroup) {
    this.char = char;
    this.idsList = idsList;
    if (idsList.length == 1 && char == idsList[0])
        this.atomic = true;
    this.toJSON = function () {
        return { c: char, l: idsList };
    };
}

function IDS(idc, operands, regionGroup) {
    this.d = idc;
    this.o = operands;
    this.r = regionGroup;
    var decomposed = false;
    this.isDecomposed = function (value) {
        if (arguments.length == 0)
            return decomposed;
        else
            decomposed = value;
    }
}

IDS.prototype.valueOf = function () {
    return this.d + this.o.reduce((prev, curr) => '' + prev + curr);
}

IDS.prototype.toString = function () {
    return this.d + this.o.reduce((prev, curr) => '' + prev + curr);
};

/**
 * Copied from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt#Fixing_charCodeAt()_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_known
 * @param {*} str 
 * @param {*} idx 
 */
function knownCharCodeAt(str, idx) {
    str += '';
    var code,
        end = str.length;

    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    while ((surrogatePairs.exec(str)) != null) {
        var li = surrogatePairs.lastIndex;
        if (li - 2 < idx) {
            idx++;
        }
        else {
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

module.exports = {
    getEntry,
    Entry,
    IDS,
    splitString,
    iterableIdsString,
    knownCharCodeAt
}
