import Compiler from './compiler';

interface Helpers {
    [key: string]: Code,
}

interface Partials {
    [key: string]: Array<Code>,
}

/**
 * Compose code
 */
export default class Code 
{

    /**
     * @var {Helpers} helpers
     */
    helpers: Helpers = {};

    /**
     * @var {Code|null} parent
     */
    parent: Code | null = null;

    /**
     * @var {Partials} partials
     */
    partials: Partials = {};

    /**
     * @var {string} src
     */
    src: string;

    /**
     * Constructor.
     * 
     * @param  {string}     src 
     */
    constructor(src: string) {
        this.src = src;
        this.partials = findPartials(this);
    }

    /**
     * Append code to a partial.
     * 
     * @param  {string}         target
     * @param  {Code|string}    content 
     * @return {void}
     */
    public append(content: Code|string, target: string): void {
        const code = getCodeFromContent(content);

        code.parent = this;

        this.partials[target].push(code);
    }

    /**
     * Determine if this is the root code instance.
     * 
     * @return {boolean}
     */
    public isRoot(): boolean {
        return this === this.root;
    }

    /**
     * Register a helper.
     * 
     * @param  {string}         name
     * @param  {Code|string}    content
     * @return {void} 
     */
    public registerHelper(name: string, content: Code|string): void {
        const helper = getCodeFromContent(content);
        const root = this.root;
        
        root.helpers = {
            ...root.helpers,
            [name]: helper,
        }
    }

    /**
     * Get the root code instance.
     * 
     * @return {Code|null}
     */
    get root(): Code {
        let level: Code = this;

        while (level.parent) {
            level = level.parent;
        }

        return level;
    }

    /**
     * Cast to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        let output: string = cleanWhitespace(this.src);

        // prepend helpers
        if (this.isRoot()) {
            output = Object.keys(this.helpers)
                .map<Code|string>(name => this.helpers[name])
                .concat(output)
                .join('\n\n');
        }

        // replace partials
        output = output.replace(/\:\w+/g, (partial, offset) => {
            const name = partial.slice(1);
            const indentation = indentationAtOffset(output, offset);
    
            return this.partials[name]
                .map(code => {
                    return code.toString()
                        .split('\n')
                        .map((ln, i) => i === 0 ? ln : indentation + ln)
                        .join('\n')
                })
                .join('\n');
        });

        return output.replace(/\n\n\n+/g, '\n\n').trim();
    }
}

/**
* Remove the extra indentation and whitespace from code.
* 
* @param  {string}     src
* @return {string} 
*/
function cleanWhitespace(src: string): string {
    let lines = src.split('\n');

    while (isIndented(lines)) {
        lines = lines.map(line => line.substr(1));
    }

    return lines.join('\n').trim();
}

/**
 * Find the partials in a piece of code.
 * 
 * @param  {Code}   code 
 */
function findPartials(code: Code): Partials {
    return (code.src.match(/\:\w+/g) || []).reduce((partials, partial) => {
        return { ...partials, [partial.slice(1)]: [] }
    }, {});
}

/**
 * Get a code instance.
 * 
 * @param  {Code|string}    content
 * @return {Code} 
 */
function getCodeFromContent(content: Code | string): Code {
    return typeof content === 'string' ? new Code(cleanWhitespace(content)) : content;
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