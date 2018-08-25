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
        dynamicAttrs: {
            foo: {
                rawValue: '1',
            },
            bar: {
                rawValue: '2',
            },
        },
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
export function test(compiler: Compiler) {
    if (compiler.parsedSource) {
        expect(Object.keys(compiler.parsedSource.template.dynamicAttrs).length).to.equal(2);
    }
}
