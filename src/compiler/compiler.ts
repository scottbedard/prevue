import { 
    CompilerOptions,
    CompilerOutput,
    ParsedSource,
} from '../types';

import { parse } from '../parser/parser';
import ComponentConstructor from './code/component_constructor';

/**
 * Compiler.
 */
export default class Compiler
{
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
    constructor(source: string, options: CompilerOptions) {
        this.options = options;
        this.source = source;
    }

    /**
     * Compile to javascript.
     * 
     * @return  {CompilerOutput}
     */
    compile(): CompilerOutput {
        const code = this.generateCode();
        
        return {
            code,
        }
    }

    /**
     * Generate prevue code.
     * 
     * @return {string}
     */
    generateCode(): string {
        const componentConstructor = new ComponentConstructor(this);

        return [
            componentConstructor.getProcessedCode(),
        ].join('\n\n');
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