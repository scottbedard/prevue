import { CompilerOutput } from 'src/types';

//
// only
//
export const only = false;

//
// options
//
export const options = {};

//
// the sandbox test will always be skipped when "only" is false
//

//
// test
//
export function test(output: CompilerOutput, Component: any) {
    console.log(output.code);
}