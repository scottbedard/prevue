import { CompilerOutput } from 'src/types';
import { createDom, expectCode } from 'test/utils';
import { expect } from 'chai';

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
export const skip = true;

//
// test
//
export function test(output: CompilerOutput, Component: any) {
    // // https://vuejs.org/v2/api/#vm-mount
    const vm = new Component();

    // $mount should be attached to the prototype
    expect(typeof vm.__proto__.$mount).to.equal('function');

    // create and mount to #app (will replace #app)
    const dom = createDom(`<div id="app"></div>`);
    vm.$mount('#app');
}