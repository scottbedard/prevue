import * as fs from 'fs';
import * as path from 'path';
import Compiler from '../../src/compiler/compiler';

// itterate over all of our subdirectories and run each parser test
describe('parser', function () {
    fs.readdirSync(path.resolve(__dirname))
        .filter(name => name !== 'parser.spec.ts')
        .forEach(dir => {
            it(dir, function () {
                const { expected, options, test } = require(path.resolve(__dirname, dir, './test.ts'));
                const source = fs.readFileSync(path.resolve(__dirname, dir, './component.vue'), 'utf8');
                const compiler = new Compiler(source, options || {});

                expect(compiler.parsedSource).toMatchObject(expected);

                if (typeof test === 'function') {
                    test(compiler.parsedSource);
                }
            });
        });
});