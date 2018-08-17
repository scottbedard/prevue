import Compiler from './compiler';

interface Partials {
    [key: string]: string,
}

/**
 * Compose code.
 * 
 * @param  {source}     source      outer source code
 * @param  {Partials}   partials    code to inject as a partial 
 * @return {string}
 */
export default function code(src: string, partials: Partials = {}): string {
    src = cleanWhitespate(src);

    // search for partials in our code
    return src.replace(/\:\w+/g, (partial, offset) => {
        const name = partial.slice(1);

        // throw an error if we find one that is not registered
        if (typeof partials[name] === 'undefined') {
            throw new Error(`Partial "${name} not found.`);
        }

        // otherwise indent and insert it
        const indentation = indentationAtOffset(src, offset);

        return partials[name].split('\n')
            .map((ln, i) => i === 0 ? ln : indentation + ln)
            .join('\n')
    });
}

/**
* Remove the extra indentation and whitespace from code.
* 
* @param  {string}     src
* @return {string} 
*/
function cleanWhitespate(src: string): string {
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
function indentationAtOffset(src: string, offset: number): string {
    const line = src.slice(0, offset).split('\n').pop() || '';

    return line.substring(0, line.search(/\S|$/))
}

/**
 * Determine if all lines start with whitespace.
 * 
 * @param  {Array<string>|string}   src
 * @return {boolean} 
 */
function isIndented(src: Array<string> | string): boolean {
    const lines = Array.isArray(src) ? src : src.split('\n');

    return lines.filter(ln => ln.startsWith(' ') || ln.length === 0 ).length === lines.length;
}