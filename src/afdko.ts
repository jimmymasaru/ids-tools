/**
 * Generate script file for 'tx'.
 * @param {string} outputMode pdf, t1, cff or any other values supported by 'tx'
 * @param {array|string} glyphs
 * @param {string} fontfile Font to be processed against
 * @param {string} outputfontfile Output file name
 * @param {int} fontIndex font index in the TTC
 */
export function getTxScript(outputMode: string, glyphs: string[] | string, fontfile: string, outputfontfile: string, fontIndex: number) {
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
 * @param {array} entries Font and Mapping files
 * @param {string} outputFontFile
 * @param {string} cidFontInfo Path to cidfontinfo
 */
export function getMergeFontsScript(entries: Entry[], outputFontFile: string, cidFontInfo: string) {
    var script = '';
    if (cidFontInfo)
        script += `-cid ${cidFontInfo}\n`;
    script += `${outputFontFile}\n`;
    for (let entry of entries) {
        script += `${entry.mapping} ${entry.font}\n`;
    }
    return script;
}

export type Entry = {
    mapping: string,
    font: string
}
