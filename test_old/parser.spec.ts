import * as fs from 'fs';
import * as path from 'path';
import Compiler from '../src/compiler/compiler';

// itterate over all of our subdirectories and run each parser test
fs.readdirSync(path.resolve(__dirname, './parser')).forEach(dir => {
    test(dir, function () {
        const { expected, options, test } = require(path.resolve(__dirname, './parser', dir, './test.js'));
        const source = fs.readFileSync(path.resolve(__dirname, './parser', dir, './component.vue'), 'utf8');

        // create a compiler for the component
        const compiler = new Compiler({
            name: 'Component',
            ...(options || {}),
        }, source);

        compiler.parse();

        // assert that our output matches the expected output
        expect(compiler.parsedSource).toMatchObject(expected);

        // call a test function if one was provided
        if (typeof test === 'function') {
            test(compiler.parsedSource);
        }
    });
});