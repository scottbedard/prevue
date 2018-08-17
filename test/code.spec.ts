import Compiler from '../src/compiler/compiler';
import code from '../src/compiler/code';

describe('code composition', function () {
    test('removes indentation and surrounding whitespace', function () {
        const output = code(`
            if (foo) {
                return true;
            }
        `);

        expect(output).toBe(`if (foo) {\n    return true;\n}`);
    });

    test('can insert other code as a partial', function () {
        const output = code(`
            if (foo) {
                :bar
            }
        `, {
            bar: code(`
                // hello world
                return true;
            `),
        });

        expect(output).toBe(`if (foo) {\n    // hello world\n    return true;\n}`);
    });
});
