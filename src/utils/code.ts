/**
* Remove extra indentation and whitespace from code.
* 
* @param  {string}     src
* @return {string} 
*/
export function cleanWhitespace(src: string): string {
    let lines = src.split('\n');

    while (isIndented(lines)) {
        lines = lines.map(line => line.substr(1));
    }

    return lines.join('\n').trim();
}

/**
 * Get the indentation at a particular offset.
 * 
 * @param  {string}     src
 * @param  {number}     offset
 * @return {number}
 */
export function indentationAtOffset(src: string, offset: number): string {
    const line = src.slice(0, offset).split('\n').pop() || '';

    return line.substring(0, line.search(/\S|$/))
}

/**
 * Determine if all lines start with whitespace.
 * 
 * @param  {Array<string>|string}   src
 * @return {boolean} 
 */
export function isIndented(src: Array<string> | string): boolean {
    const lines = Array.isArray(src) ? src : src.split('\n');

    return lines.filter(ln => ln.startsWith(' ') || ln.length === 0 ).length === lines.length;
}