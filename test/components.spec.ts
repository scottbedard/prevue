import * as fs from 'fs';
import * as path from 'path';
import Compiler from '../src/compiler/compiler';

// itterate over all of our subdirectories and run each parser test
describe('components', function () {
    fs.readdirSync(path.resolve(__dirname, './components'))
        .forEach(dir => {
            it(dir, function () {
                const { options, test } = require(path.resolve(__dirname, './components', dir, './test.ts'));
                const source = fs.readFileSync(path.resolve(__dirname, './components', dir, './component.vue'), 'utf8');

                // compile our component to a function
                const compiler = new Compiler(source, options || {});

                const output = compiler.compile();

                if (typeof test === 'function') {
                    test(output);
                }
            });
        });
});