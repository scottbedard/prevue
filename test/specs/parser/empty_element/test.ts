import Compiler from '../../../src/compiler/compiler';
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
        children: [],
        nodeType: 'element',
        tagName: 'div',
        textContent: null,
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
        expect((compiler.parsedSource.template.children || []).length).to.equal(0);
    }
}