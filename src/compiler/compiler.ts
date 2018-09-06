import { 
    CompilerOptions,
    CompilerOutput,
    ParsedSource,
    SerializedNode,
} from 'src/types';

import Code from './code';
import Fragment from './fragment';
import { parse } from 'src/parser/parser';
import { processors } from './processors/index';

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
        this.code = createCodeInstance(this);

        // bind initialization helpers
        this.code.registerHelper('init');
        this.code.append(`init(this);`, 'init');

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
    // 1. itterate over processors and give each of them an opportunity to opportunity
    //    to announce that they need a new fragment context. if any raise their hand
    //    hand by returning a new fragment name, go ahead and create that fragment.
    let currentFragment = fragment;

    for (let i = 0, len = processors.length; i < len; i++) {
        const processor = processors[i];
        const fragmentName = processor.requiresNewFragment(node);

        if (fragmentName) {
            currentFragment = createFragment(compiler, fragmentName);
            break;
        }
    }

    // 2. pass current fragment to each processor so they can append to the various partials
    processors.forEach(processor => processor.process(compiler, currentFragment, node));

    // 3. call any post-processors that are defined

    // 4. recursively process child nodes
    node.children.forEach(child => processFragment(compiler, currentFragment, child));
}