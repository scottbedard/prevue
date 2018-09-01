import * as fs from 'fs';
import * as path from 'path';
import Compiler from 'src/compiler/compiler';

//
// specs
//
describe('components', () => {
    const parserDir = path.resolve(__dirname, 'components');

    fs.readdirSync(parserDir)
        .filter(file => file !== '_template')
        .forEach(file => {
            const source = fs.readFileSync(path.resolve(__dirname, './components', file, './component.vue'), 'utf8');
            const test = require(path.resolve(__dirname, './components', file, './test.ts'));

            const testFn = function () {
                // compile our component to a function
                const compiler = new Compiler({
                    cleanOutput: true,
                    format: 'fn',
                    name: 'Component',
                    ...(test.options || {}),
                }, source);

                const output = compiler.compile();

                if (typeof test.test === 'function') {
                    test.test(output, new Function(output.code)());
                }
            }

            // focus, skip, or standard run the test
            if (file === '_sandbox') {
                if (test.only) {
                    it.only(file, testFn);
                }
            } else {
                if (test.only) it.only(file, testFn);
                else if (test.skip) it.skip(file, testFn);
                else it(file, testFn);
            }
        });
});