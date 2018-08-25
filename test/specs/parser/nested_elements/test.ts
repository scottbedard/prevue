import Compiler from '../../../../src/compiler/compiler';
import { expect } from 'chai';

//
// exclude
//
// export const exclude = {};

//
// include
//
export const include = {
    template: {
        children: [
            {
                nodeType: 'text',
                textContent: '\n        Foo bar baz\n        ',
            },
            {
                children: [
                    {
                        nodeType: 'text',
                        textContent: 'Hello world',
                    },
                ],
                nodeType: 'element',
                tagName: 'p',
            },
            {
                nodeType: 'text',
                textContent: '\n    ',
            },
        ],
        nodeType: 'element',
        tagName: 'div',
    },
};

//
// only
//
export const only = false;

//
// options
//
export const options = {};

//
// skip
//
export const skip = false;

//
// test
//
// export function test(compiler: Compiler) {
//     // ...
// }