import Code from '../../src/compiler/code';
import Compiler from '../../src/compiler/compiler';
import { expect } from 'chai';

//
// specs
//
describe('code generation', function () {
    it('removes indentation and surrounding whitespace', function () {
        const code = new Code(`
            if (foo) {
                return true;
            }
        `);

        expect(code.toString()).to.equal(`if (foo) {\n    return true;\n}`);
    });

    it('appends to partials', function () {
        const code = new Code(`
            if (foo) {
                :bar
            }
        `);

        expect(code.partials).to.deep.equal({ bar: [] });

        code.append(`
            // hello world
            return true;
        `, 'bar');

        expect(code.toString()).to.equal(`if (foo) {\n    // hello world\n    return true;\n}`);
    });

    it('computes hierarchical parent relationships', function () {
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
        
        expect(foo.root).to.equal(foo);
        expect(foo.parent).to.be.null;
        expect(bar.root).to.equal(foo);
        expect(bar.parent).to.equal(foo);
        expect(baz.root).to.equal(foo);
        expect(baz.parent).to.equal(bar);
    });

    it('register helper functions', function () {
        const foo = new Code(`
            // foo
            :children
        `);

        const bar = new Code(`// bar`);

        foo.append(bar, 'children');
        foo.registerHelper('someHelper', `function someHelper() {}`);
        bar.registerHelper('someOtherHelper', `function someOtherHelper() {}`);

        expect(foo.toString()).to.equal(`function someHelper() {}\n\nfunction someOtherHelper() {}\n\n// foo\n// bar`)
    });

    it('registers partial resolvers', function () {
        const code = new Code(`
            if (true) {
                :hello
            }
        `);

        code.registerDynamicPartial('hello', (c) => {
            expect(c).to.equal(code);

            return `
                // line 1
                // line 2
            `
        });

        expect(code.toString()).to.equal(`if (true) {\n    // line 1\n    // line 2\n}`);
    });
});
