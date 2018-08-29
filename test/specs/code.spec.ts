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
            // bar
        `, 'bar');

        expect(code.toString()).to.equal(`if (foo) {\n    // bar\n}`);
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

    it('exposes an "partialIsEmpty" helper', function () {
        const code = new Code(`
            :somePartial
        `);

        expect(code.partialIsEmpty('somePartial')).to.be.true;

        code.append(`
            // whatever
        `, 'somePartial');

        expect(code.partialIsEmpty('somePartial')).to.be.false;
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

    it.skip('generates unique names for identifiers', function () {
        const parent = new Code(`
            // parent $foo
            :children
        `);

        const child = new Code(`
            // child $foo
        `);

        parent.append(child, 'children');
    });

    it('can be rendered with helpers', function () {
        const parent = new Code(`
            if (true) {
                :children
            }
        `);

        const noop = parent.registerHelper('noop');

        parent.append(`
            ${noop}();
        `, 'children');

        expect(parent.render()).to.equal(`function noop(){}\n\nif (true) {\n    noop();\n}`)
    })
});
