import * as fs from 'fs';
import * as path from 'path';
import Compiler from 'src/compiler/compiler';
import { ParsedSource } from 'src/types';
import { expect } from 'chai';

//
// specs
//
describe('parser', () => {
    const parserDir = path.resolve(__dirname, 'parser');

    fs.readdirSync(parserDir)
        .filter(file => file !== '_template')
        .forEach(file => {
            const source = fs.readFileSync(path.resolve(__dirname, './parser', file, './component.vue'), 'utf8');
            const test = require(path.resolve(__dirname, './parser', file, './test.ts'));

            const testFn = function () {
                // create a compiler for the component
                const compiler = new Compiler({
                    name: 'Component',
                    ...(test.options || {}),
                }, source);

                // parse the component
                compiler.parse();

                const excludeType = typeof test.exclude;
                const includeType = typeof test.include;
                const testType = typeof test.test;
                
                // make sure all included/excluded properties are present/absent
                if (includeType !== 'undefined') {
                    expect(includeType).to.equal('object', 'Invalid parser include');
                    expect(compiler.parsedSource).to.containSubset(test.include);
                }

                if (excludeType !== 'undefined') {
                    expect(excludeType).to.equal('object', 'Invalid parser exclude');
                    expect(compiler.parsedSource).not.to.containSubset(test.exclude);
                }

                // run the test function
                if (testType === 'function') {
                    expect(testType).to.equal('function', 'Invalid parser test');
                    test.test(compiler);
                }
            }

            // focus, skip, or standard run the test
            if (test.only) it.only(file, testFn);
            else if (test.skip) it.skip(file, testFn);
            else it(file, testFn);
        });
});