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
        staticAttrs: {
            one: 'two',
            three: 'four',
        },
    }
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
export function test(compiler: Compiler) {
    if (compiler.parsedSource) {
        expect(Object.keys(compiler.parsedSource.template.staticAttrs || {}).length).to.equal(2);
    }
}