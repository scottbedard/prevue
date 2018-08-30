import Code from '../../src/compiler/code';
import Compiler from '../../src/compiler/compiler';
import { expect } from 'chai';

//
// specs
//
describe('code generation', function () {
    it('chai code assertions', function () {
        // different whitespace
        expect(`
            if (foo) {
                bar();
            }
        `).to.equalCode(`if (foo) { bar() }`)

        // different statement endings
        expect(`foo()`).to.equalCode(`foo();`);

        // different quotation styles
        expect(`let foo = "bar"`).to.equalCode(`let foo = 'bar'`);

        // different brackets
        expect(`if (foo) bar()`).to.equalCode(`if (foo) { bar(); }`);

        // asserting with code objects
        expect(new Code(`let one = 1`)).to.equalCode(`let one = 1`);
    });

    it('appends to partials', function () {
        const code = new Code(`
            if (foo) {
                :bar
            }
        `);

        expect(code.partials).to.deep.equal({ bar: [] });

        code.append(`
            bar();
        `, 'bar');

        expect(code.toString()).to.equalCode(`
            if (foo) {
                bar();
            }
        `);
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
        const src = new Code(`
            if (foo) {
                :hello
            }
        `);

        src.registerDynamicPartial('hello', (c) => {
            expect(c).to.equal(src);

            return `
                bar();
            `
        });

        expect(src).to.equalCode(`
            if (foo) {
                bar();
            }
        `);
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
            if (foo) {
                :children
            }
        `);

        const noop = parent.registerHelper('noop');

        parent.append(`
            ${noop}();
        `, 'children');

        expect(parent.render()).to.equalCode(`
            function noop(){}
            
            if (foo) {
                noop();
            }
        `);
    });

    it('only includes a helper once', function () {
        const parent = new Code(`
            if (foo) {
                :children
            }
        `);

        const noop1 = parent.registerHelper('noop');
        const noop2 = parent.registerHelper('noop');

        parent.append(`
            ${noop1}();
            ${noop2}();
        `, 'children');

        expect(parent.render()).to.equalCode(`
            function noop(){}

            if (foo) {
                noop();
                noop();
            }
        `);
    });
});
