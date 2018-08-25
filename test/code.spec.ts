import Compiler from '../src/compiler/compiler';
import Code from '../src/compiler/code';

describe('code composition', function () {
    test('removes indentation and surrounding whitespace', function () {
        const code = new Code(`
            if (foo) {
                return true;
            }
        `);

        expect(code.toString()).toBe(`if (foo) {\n    return true;\n}`);
    });

    test('can append code to partials', function () {
        const code = new Code(`
            if (foo) {
                :bar
            }
        `);

        expect(code.partials).toEqual({ bar: [] });

        code.append(`
            // hello world
            return true;
        `, 'bar');

        expect(code.toString()).toBe(`if (foo) {\n    // hello world\n    return true;\n}`);
    });

    test('parent code relationships', function () {
        const foo = new Code(`
            // foo
            :whatever
        `);

        const bar = new Code(`
            // bar
            :whatever
        `);

        const baz = new Code(`// baz`);

        foo.append(bar, 'whatever');
        bar.append(baz, 'whatever');
        
        expect(foo.root).toBe(foo);
        expect(foo.parent).toBe(null);
        expect(bar.root).toBe(foo);
        expect(bar.parent).toBe(foo);
        expect(baz.root).toBe(foo);
        expect(baz.parent).toBe(bar);
    });

    test('registering a helper function', function () {
        const foo = new Code(`
            // foo
            :children
        `);

        const bar = new Code(`// bar`);

        foo.append(bar, 'children');
        foo.registerHelper('someHelper', `function someHelper() {}`);
        bar.registerHelper('someOtherHelper', `function someOtherHelper() {}`);

        expect(foo.toString()).toBe(`function someHelper() {}\n\nfunction someOtherHelper() {}\n\n// foo\n// bar`)
    });
});
