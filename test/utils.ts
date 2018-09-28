import * as uglify from 'uglify-js';
import Code from '../src/compiler/code';
import { JSDOM } from 'jsdom';
import { lint } from '../src/utils/linter';

const babel = require('@babel/core');

/**
 * Create a dom to work with
 * 
 * @param  {string} source
 * @return {JSDOM}
 */
export function createDom(source: string = '') {
    return new JSDOM(`
        <!doctype html>
        <html>
            <body>
                ${source}
            </body>
        </html>
    `);
}

/**
 * Helper function for making code assertions since Typescript
 * doesn't seem to like adding custom matchers to Chai.
 * 
 * @param  {string | Code}  rawActual
 * @return {Object}
 */
export function expectCode(rawActual: string | Code) {
    const min = (src: string): string => {
        const transpiledCode = babel.transform(src, {
            presets: ['@babel/preset-env'],
        }).code;

        const result = uglify.minify(transpiledCode, { 
            compress: {}, 
            mangle: false,
        });

        // throw an error if minification failed
        if (result.error) {
            console.log('Failed to minify source code for comparison');
            console.log();
            console.log(result);
            console.log();
            console.log(src);
            console.log();
            
            throw result.error;
        }

        return result.code;
    }

    const compare = (rawActual: string, rawExpected: string): boolean => {
        const actual = min(String(rawActual).trim());
        const expected = min(String(rawExpected).trim());

        return actual === expected;
    }


    const indent = (src: string): string => src.split('\n').map(line => '    ' + line).join('\n');

    return {
        not: {
            to: {
                equal(rawExpected: string) {
                    const strActual = String(rawActual).trim();
                    const strExpected = String(rawExpected).trim();

                    if (compare(strActual, strExpected)) {
                        const lintActual = indent(lint(strActual));
                        const lintExpected = indent(lint(strExpected));
                        
                        throw new Error(`\n\nFailed asserting code inequality\n\nExpected:\n${lintExpected}\n\nActual:\n${lintActual}\n\n`);
                    }
                },
            },
        },
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