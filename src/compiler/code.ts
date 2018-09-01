import helpers from './helpers';
import { lint } from 'src/utils/linter';

type DynamicPartialResolver = (code?: Code) => Code | string;

interface CodeOptions {
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
    /**
     * @var {DynamicPartials} dynamicPartials
     */
    dynamicPartials: DynamicPartials = {};

    /**
     * @var {Helpers} helpers
     */
    helpers: Array<string> = [];

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
     * Register a helper.
     * 
     * @param  {string} name
     * @return {string}
     */
    public registerHelper(name: string): string {
        if (typeof helpers[name] === 'undefined') {
            throw new Error(`Failed to register helper "${name}", function not found.`);
        }

        const root = this.root;

        if (root.helpers.indexOf(name) === -1) {
            root.helpers.push(name);
        }
        
        return root.getNamedIdentifier(name);
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

        let output = this.toString();
        
        this.helpers
            .slice(0)
            .sort()
            .filter((helper: string) => typeof helpers[helper] === 'function')
            .forEach((helper: string) => {
                const name = this.generateNamedIdentifier(helper);
                const helperFn = helpers[helper](name);

                output = helperFn + '\n\n' + output;
            });

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
        output = output.replace(/\:\w+/g, (partial, offset): string => {
            const name = partial.slice(1);
            
            // dynamic partials
            if (typeof this.dynamicPartials[name] !== 'undefined') {
                return getDynamicPartial(this, name).toString();
            }
            
            // default partial resolution
            return this.partials[name]
                .map(code => code.toString())
                .join('\n');
        });

        return output.replace(/\n\n\n+/g, '\n\n').trim();
    }
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

    return typeof content === 'string' ? new Code(content): content;
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
