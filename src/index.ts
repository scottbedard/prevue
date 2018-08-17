import Compiler from './compiler/compiler';

/**
 * Compile source code into a component.
 * 
 * @param  {string}   source    the raw source code
 * @param  {Object}   options   compiler options
 * @return {void}
 */
export function compile(source: string, options: any) {
    const compiler = new Compiler(options, source);

    const code = compiler.compile();

    return {
        code,
    }
}
