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
        this.code = createCodeInstance(this);
    }

    /**
     * Compile to javascript.
     * 
     * @return  {CompilerOutput}
     */
    compile(): CompilerOutput {
        this.code = new Code(`
            :fragments

            return function ${this.options.name}() {
                :init
            }
        `);

        createMainFragment(this);

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

/**
 * Generate a fresh code instance for a component.
 * 
 * @param  {Compiler}   compiler
 * @return {Code} 
 */
function createCodeInstance(compiler: Compiler): Code {
    // @todo: check options for output type

    return new Code(`
        :fragments

        return function ${compiler.options.name}() {
            :init
        }
    `);
}

/**
 * Create the main fragment and append it to initialization.
 * 
 * @param  {Compiler}   compiler
 * @return {void} 
 */
function createMainFragment(compiler: Compiler): void {
    const constructorName = compiler.code.generateNamedIdentifier('createMainFragment');
    const instanceName = compiler.code.generateNamedIdentifier('mainFragment');
    const fragment = new Fragment(constructorName);
    
    compiler.code.append(fragment, 'fragments');
    compiler.code.append(`const ${instanceName} = ${constructorName}();`, 'init');
}