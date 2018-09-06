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
                isRoot: false,
            },
        ],
        isRoot: true,
    }
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
};

//
// skip
//
export const skip = false;

//
// test
//
// export function test(compiler: Compiler) {
//     console.log(JSON.stringify(compiler.parsedSource, null, 4));
// }