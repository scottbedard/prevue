import { 
    CompilerOptions,
    CompilerOutput,
    ParsedSource,
    SerializedNode,
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
    parsedSource: ParsedSource;

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
        this.parsedSource = parse(source, options);
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

        // create a main fragment, and assign it to a variable in our "init" partial
        const mainFragmentVar = this.code.generateNamedIdentifier('mainFragment');
        const mainFragment = createFragment(this, 'createMainFragment');

        this.code.append(`
            const ${mainFragmentVar} = ${mainFragment.name}();
        `, 'init');

        // recursively process all fragments, starting with the template root
        processFragment(this, mainFragment, this.parsedSource.template);

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
 * Create a dom fragment.
 * 
 * @param  {Compiler}   compiler
 * @param  {string}     name
 * @return {Fragment} 
 */
function createFragment(compiler: Compiler, name: string): Fragment {
    const fragment = new Fragment(compiler.code.generateNamedIdentifier(name));
    
    compiler.code.append(fragment, 'fragments');

    return fragment;
}

/**
 * Recursively generate fragments to represent the dom.
 * 
 * @param  {Compiler}       compiler
 * @param  {Fragment}       fragment
 * @param  {SerializedNode} node
 * @return {void}
 */
function processFragment(compiler: Compiler, fragment: Fragment, node: SerializedNode): void {
    // 1. itterate over processors and give each of them an opportunity
    //    to declare that we need a new fragment.

    // 2. if any processors raise their hand and say we need a new fragment,
    //    go ahead and instantiate one here. we'll also need to append that
    //    new fragment to the compiler's main code instance.

    // 3. take the current fragment, or the newly created one, and pass
    //    it to each of the processors so they can append code to the different
    //    fragment partials.

    // 4. call any post-processors that are defined

    // 5. recursively process child nodes
}