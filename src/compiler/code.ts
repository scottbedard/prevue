import * as helpers from './helpers';
import { camelCase, capitalize } from 'lodash';
import { lint } from 'src/utils/linter';
import { sortBy, uniq } from 'lodash';

type DynamicPartialResolver = (code?: Code) => Code | string;

interface CodeOptions {
    helpers?: 'inline' | 'import',
    identifiers?: Array<string>,
}

interface DynamicPartials {
    [key: string]: DynamicPartialResolver,
}

interface Partials {
    [key: string]: Array<Code>,
}

/**
 * Compose code
 */
export default class Code 
{
    [index: string]: any;

    /**
     * @var {DynamicPartials} dynamicPartials
     */
    dynamicPartials: DynamicPartials = {};

    /**
     * @var {'inline'|'import'} helpers
     */
    helpers: 'inline' | 'import';

    /**
     * @var {Array<string>} identifiers
     */
    identifiers: Array<string> = [];

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
    constructor(src: string = '', options: CodeOptions = {}) {
        this.src = removeLeadingIndentation(src);
        this.partials = findPartials(this);
        this.helpers = options.helpers || 'inline';
        this.identifiers = options.identifiers || [];
    }

    /**
     * Append code to a partial.
     * 
     * @param  {string}         target
     * @param  {Code|string}    content 
     * @return {void}
     */
    public append(content: Code|string, partial: string): void {
        // throw an error if the partial doesn't exist
        if (!this.hasPartial(partial)) {
            throw new Error(`Failed to append to "${partial}", partial not found.`);
        }

        const code = getCodeFromContent(content);

        code.parent = this;

        this.partials[partial].push(code);
    }

    /**
     * Generate a named identifier.
     * 
     * @param  {string}     name        an ideal name for the identifier, if it's available
     * @param  {boolean}    remember    causes the identifier name to only be generated once
     * @return {string}
     */
    public generateNamedIdentifier(name: string, remember: boolean = true): string {
        // always generate identifiers from the root context
        if (!this.isRoot()) {
            return this.root.generateNamedIdentifier(name, remember);
        }

        // itterate over possible identifiers until we find one that is unused
        let i = 0;
        let identifier = name;

        while (this.identifiers.includes(identifier)) {
            identifier = name + String(++i);
        }

        // remember this identifier to prevent generating it again
        if (remember) {
            this.identifiers.push(identifier)
        }

        // and finally, return the named identifier
        return identifier;
    }

    /**
     * Helper to generate identifiers without incrementing a value.
     * 
     * @param  {string}     name
     * @return {string}
     */
    public getNamedIdentifier(name: string): string {
        return this.generateNamedIdentifier(name, false);
    }

    /**
     * Determine if a partial exists.
     * 
     * @param  {string}     name    the name of the partial
     * @return {boolean}
     */
    public hasPartial(name: string): boolean {
        return typeof this.partials[name] !== 'undefined';
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
     * Determine if a partial is empty.
     * 
     * @param  {string}     name
     * @return {boolean}
     */
    public partialIsEmpty(name: string): boolean {
        return Array.isArray(this.partials[name]) && this.partials[name].length === 0;
    }

    /**
     * Register a dynamic partial
     * 
     * @param  {string}                     name
     * @param  {DynamicPartialResolver}     resolver
     * @return {void}
     */
    public registerDynamicPartial(name: string, resolver: DynamicPartialResolver): void {
        this.dynamicPartials[name] = resolver;
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
     * Render a code tree from the root down.
     * 
     * @return {string}
     */
    public render(): string {
        if (!this.isRoot()) {
            return this.root.render();
        }

        let output = replaceHelpers(this);

        return lint(output.trim());
    }

    /**
     * Cast to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        let output: string = this.src;

        // replace named identifiers
        output = output.replace(/\$\w+/g, (partial, offset) => {
            return this.generateNamedIdentifier(partial.slice(1));
        });

        // replace partials
        output = output.replace(/\:\w+/g, (partial: string): string => {
            const name = partial.slice(1);

            // dynamic partials
            const partialFn = 'get' + capitalize(camelCase(partial)) + 'Partial';

            if (typeof this[partialFn] === 'function') {
                return getCodeFromContent(this[partialFn](this)).toString();
            }
            
            // dynamic partials (deprecated, use partial functions instead)
            if (typeof this.dynamicPartials[name] !== 'undefined') {
                return getDynamicPartial(this, name).toString();
            }
            
            // default partial resolution
            return this.partials[name]
                .map(code => code.toString())
                .join('\n\n');
        });

        return output.replace(/\n\n\n+/g, '\n\n').trim();
    }
}

/**
 * Recursively find all helpers.
 * 
 * @param  {string}         src
 * @return {Array<string>} 
 */
function findHelpers(src: string): Array<string> {
    const result = (src.match(/\@\w+/g) || []).map(rawName => rawName.slice(1));

    result.forEach(name => {
        if (typeof (<any>helpers)[name] !== 'string') {
            throw `Unknown helper "${name}"`;
        }

        findHelpers((<any>helpers)[name])
            .forEach(subHelper => result.push(subHelper));
    });

    return result;
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
    return typeof content === 'string' ? new Code(content) : content;
}

/**
 * Resolve a dynamid partial.
 * 
 * @param  {Code}   code 
 * @param  {string} name
 * @return {Code} 
 */
function getDynamicPartial(code: Code, name: string): Code {
    const content = code.dynamicPartials[name](code);

    return getCodeFromContent(content);
}

/**
 * Determine if all lines start with whitespace.
 * 
 * @param  {Array<string>|string}   src
 * @return {boolean} 
 */
function isIndented(src: Array<string> | string): boolean {
    const lines = Array.isArray(src) ? src : src.split('\n');

    // if no lines start with a whitespace, it isn't indented
    if (lines.filter(ln => ln.startsWith(' ')).length === 0) {
        return false;
    }

    return lines.filter(ln => ln.startsWith(' ') || ln.length === 0 ).length === lines.length;
}

/**
* Remove extra leading indentation from code.
* 
* @param  {string}     src
* @return {string} 
*/
function removeLeadingIndentation(src: string): string {
    let lines = src.split('\n');

    while (isIndented(lines)) {
        lines = lines.map(line => line.substr(1));
    }

    return lines.join('\n').trim();
}

/**
 * Replace helpers in source code.
 * 
 * @param  {Code}   code
 * @return {string}
 */
function replaceHelpers(code: Code): string {
    let src = code.toString();
    const usedHelpers = sortBy(uniq(findHelpers(src)));

    // inline helpers
    if (code.helpers === 'inline') {
        const helperSrc = usedHelpers.map(name => (<any>helpers)[name]).join('\n');
        src = helperSrc + '\n' + src
    } 
    
    // imported helpers
    else {
        const helperSrc = `import { ${usedHelpers.join(', ') } } from '@prevue/prevue'`;
        src = helperSrc + '\n' + src;
    }
   
    return src.replace(/\@(?!prevue)\w+/g, name => name.slice(1));;
}