import { CompilerOutput } from '../../../../src/types';

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
    console.log(output.code);
}