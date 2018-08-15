import { 
    CompilerOptions,
    CompilerOutput,
    ParsedSource,
} from '../types';

import { parse } from '../parser/parser';

export default class Compiler
{
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
    constructor(source: string, options: CompilerOptions) {
        this.options = options;
        this.source = source;
        this.parsedSource = parse(this.source, this.options);
    }

    /**
     * Compile to javascript.
     * 
     * @return  {CompilerOutput}
     */
    compile(): CompilerOutput {
        const code = `
            console.log('oh yeaaaaa');
        `;

        return {
            code,
        }
    }
}