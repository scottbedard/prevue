import Code from 'src/compiler/code';
import Compiler from 'src/compiler/compiler';
import { expect } from 'chai';
import { expectCode } from 'test/utils';

//
// specs
//
describe('code generation', function () {
    it('chai code assertions', function () {
        // different whitespace
        expectCode(`
            if (foo) {
                bar();
            }
        `).to.equal(`if (foo) { bar() }`)

        // different statement endings
        expectCode(`foo()`).to.equal(`foo();`);

        // different quotation styles
        expectCode(`let foo = "bar"`).to.equal(`let foo = 'bar'`);

        // different brackets
        expectCode(`if (foo) bar()`).to.equal(`if (foo) { bar(); }`);

        // asserting with code objects
        expectCode(new Code(`let one = 1`)).to.equal(`let one = 1`);
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

        expectCode(code).to.equal(`
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

        expectCode(src).to.equal(`
            if (foo) {
                bar();
            }
        `);
    });

    it('generates unique names for identifiers', function () {
        const parent = new Code(`:children`, { identifiers: ['foo'] });
        const child = new Code();

        parent.append(child, 'children');

        // generate the identifier foo from both contexts, but don't remember it
        expect(parent.generateNamedIdentifier('foo')).to.equal('foo1');
        expect(child.generateNamedIdentifier('foo')).to.equal('foo2');

        // generate the idenfitier again, and this time dont remember it
        expect(parent.generateNamedIdentifier('bar', false)).to.equal('bar');
        expect(child.generateNamedIdentifier('bar', false)).to.equal('bar');
    });

    it('gets a named identifier', function () {
        const parent = new Code(`:children`);
        const child = new Code();

        parent.append(child, 'children');

        expect(parent.getNamedIdentifier('noop')).to.equal('noop');
        expect(child.getNamedIdentifier('noop')).to.equal('noop');
    });

    it('automatically registers dynamic partials by method naming convention', function () {
        class Foo extends Code {
            constructor() {
                super(`
                    foo();
                    :whatever
                `);
            }

            getWhateverPartial() {
                return `bar();`;
            }
        }
        
        expectCode(new Foo).to.equal(`
            foo();
            bar();
        `);
    });

    it('can inline helpers', function() {
        const code = new Code(`
            @noop();
        `);

        expectCode(code.render()).to.equal(`
            function noop() {}
            noop();
        `);
    });

    it('only includes a helper once', function () {
        const code = new Code(`
            @noop();
            @noop();
            @noop();
        `);

        expectCode(code.render()).to.equal(`
            function noop() {}
            noop();
            noop();
            noop();
        `);
    })

    it('can inline helpers with a reserved name');

    it('can import helpers', function() {
        const code = new Code(`
            @noop();
        `, {
            helpers: 'import',
        });

        expectCode(code.render()).to.equal(`
            import { noop } from '@prevue/prevue';
            noop();
        `);
    });

    it('can import helpers with a reserved name');
});
