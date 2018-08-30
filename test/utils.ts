import * as uglify from 'uglify-js';
import Code from '../src/compiler/code';
import { lint } from '../src/utils/linter';

/**
 * Helper function for making code assertions since Typescript
 * doesn't seem to like adding custom matchers to Chai.
 * 
 * @param  {string | Code}  rawActual
 * @return {Object}
 */
export function expectCode(rawActual: string | Code) {
    const min = (src: string): string => uglify.minify(src, { compress: {}, mangle: false }).code;
    const compare = (actual: string, expected: string): boolean => min(String(actual).trim()) === min(String(expected).trim());
    const indent = (src: string): string => src.split('\n').map(line => '    ' + line).join('\n');

    return {
        to: {
            equal(rawExpected: string) {
                const strActual = String(rawActual).trim();
                const strExpected = String(rawExpected).trim();

                if (!compare(strActual, strExpected)) {
                    const lintActual = indent(lint(strActual));
                    const lintExpected = indent(lint(strExpected));
                    
                    throw new Error(`\n\nFailed asserting code equality\n\nExpected:\n${lintExpected}\n\nActual:\n${lintActual}\n\n`);
                }
            },
        },
    };
}