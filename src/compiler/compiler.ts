import { 
    CompilerOptions,
    CompilerOutput,
    ParsedSource,
} from 'src/types';

import { parse } from 'src/parser/parser';
import Code from './code';
import Fragment from './fragment';

/**
 * Compiler.
 */
export default class Compiler
{
    /**
     * @var  {Code}     code
     */
    code: Code;

    /**
     * @var options
     */
    options: CompilerOptions;

    /**
     * @var parsedSource
     */
    parsedSource: ParsedSource | null = null;

    /**
     * @var source
     */
    source: string;

    /**
     * Constructor.
     * 
     * @param {string}          source
     * @param {CompilerOptions} options     
     */
    constructor(options: CompilerOptions, source: string = '') {
        this.options = options;
        this.source = source;

        this.code = new Code(`
            :fragments

            return function ${options.name}() {
                :init
            }
        `);

        const mainFragmentName = this.code.generateNamedIdentifier('mainFragment');
        const fragment = new Fragment(mainFragmentName);

        this.code.append(`const f = ${mainFragmentName}();`, 'init');

        this.code.append(fragment, 'fragments');
    }

    /**
     * Compile to javascript.
     * 
     * @return  {CompilerOutput}
     */
    compile(): CompilerOutput {
        return {
            code: this.code.render(),
        }
    }

    /**
     * Parse source code.
     * 
     * @return {void}
     */
    parse(): void {
        this.parsedSource = parse(this.source, this.options);
    }
}