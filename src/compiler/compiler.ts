import { 
    CompilerOptions,
    CompilerOutput,
    ParsedSource,
} from '../types';

import { parse } from '../parser/parser';
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
                var f = createMainFragment();
            }
        `);

        const createMainFragment = new Fragment;

        this.code.append(createMainFragment, 'fragments');
        
        this.code.registerHelper('noop', 'function noop(){}');
    }

    /**
     * Compile to javascript.
     * 
     * @return  {CompilerOutput}
     */
    compile(): CompilerOutput {
        return {
            code: this.code.toString(),
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