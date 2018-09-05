import { CompilerOutput } from 'src/types';

//
// only
// the sandbox test will always be skipped when "only" is false
//
export const only = false;

//
// options
//
export const options = {};

//
// test
//
export function test(output: CompilerOutput, Component: any) {
    console.log(output.code);
}