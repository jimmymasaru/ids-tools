'use strict';

/**
 * Generate script file for 'tx'.
 * @param {string} outputMode pdf, t1, cff or any other values supported by 'tx'
 * @param {array|string} glyphs 
 * @param {string} fontfile Font to be processed against
 * @param {string} outputfontfile Output file name
 * @param {int} fontIndex font index in the TTC
 */
function getTxScript(outputMode, glyphs, fontfile, outputfontfile, fontIndex) {
    var glyphParameter = '';
    if (typeof glyphs == 'string') {
        glyphParameter = glyphs;
    } else {
        for (let glyph of glyphs) {
            glyphParameter += ',' + glyph;
        }
        if (glyphParameter)
            glyphParameter = glyphParameter.substring(1);
    }

    var script = `-${outputMode}\n`;
    if (fontIndex != null)
        script += `-i\n${fontIndex}\n`;
    script += `-g\n"${glyphParameter}"\n`;
    script += `-o\n"${outputfontfile}"\n` // o must be before f
    script += `-f\n"${fontfile}"\n`;
    return script;
}

/**
 * 
 * @param {array} fms Font and Mapping files
 * @param {string} outputfontfile 
 * @param {string} cidfontinfo Path to cidfontinfo
 */
function getMergeFontsScript(fms, outputfontfile, cidfontinfo) {
    var script = '';
    if (cidfontinfo)
        script += `-cid ${cidfontinfo}\n`;
    script += `${outputfontfile}\n`;
    for (let entry of fms) {
        script += `${entry.mapping} ${entry.font}\n`;
    }
    return script;
}

module.exports = {
    getTxScript,
    getMergeFontsScript
}
