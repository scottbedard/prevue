import Compiler from './compiler';
import helpers from './helpers';

import { 
    cleanWhitespace, 
    indentationAtOffset,
    isIndented,
} from '../utils/code';

type DynamicPartialResolver = (code?: Code) => Code | string;

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
    constructor(src: string = '') {
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
     * 
     * @param name 
     */
    public generateNamedIdentifier(name: string): string {
        return name;
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
     * @param name 
     */
    public registerDynamicPartial(name: string, resolver: DynamicPartialResolver) {
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

        root.helpers.push(name);
        
        return root.generateNamedIdentifier(name);
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
        return this.isRoot 
            ? this.renderSubtree() 
            : this.root.renderSubtree();
    }

    /**
     * Render a code free from this instance down.
     * 
     * @return {string}
     */
    public renderSubtree(): string {
        const root = this.root;
        let output = this.toString();
        
        this.helpers
            .slice(0)
            .sort()
            .filter((helper: string) => typeof helpers[helper] === 'function')
            .forEach((helper: string) => {
                const name = root.generateNamedIdentifier(helper);
                const helperFn = cleanWhitespace(helpers[helper](name));

                output = helperFn + '\n\n' + output;
            });

        return output;
    }

    /**
     * Cast to a string.
     * 
     * @return {string}
     */
    public toString(): string {
        let output: string = cleanWhitespace(this.src);

        // replace named identifiers
        output = output.replace(/\$\w+/g, (partial, offset) => {
            return this.generateNamedIdentifier(partial.slice(1));
        });

        // replace partials
        output = output.replace(/\:\w+/g, (partial, offset): string => {
            const name = partial.slice(1);
            const indentation = indentationAtOffset(output, offset);
            const applyLineIndentation = (ln: string, i: number) => i === 0 ? ln : indentation + ln;
            
            // dynamic partials
            if (typeof this.dynamicPartials[name] !== 'undefined') {
                return getDynamicPartial(this, name)
                    .toString()
                    .split('\n')
                    .map(applyLineIndentation)
                    .join('\n');
            }
            
            // default partial resolution
            return this.partials[name]
                .map(code => {
                    return code.toString()
                        .split('\n')
                        .map(applyLineIndentation)
                        .join('\n')
                })
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
    return typeof content === 'string' ? new Code(cleanWhitespace(content)) : content;
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

