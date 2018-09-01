import Compiler from 'src/compiler/compiler';
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
                children: [
                    {
                        nodeType: 'text',
                        textContent: 'Hello world',
                    },
                ],
                nodeType: 'element',
                tagName: 'span',
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
export const options = {
    trimWhitespace: true,
}

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